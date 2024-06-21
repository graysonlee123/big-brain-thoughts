import { AuthOptions } from 'next-auth'
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from './db'
import discordAvatarUrl from './discordAvatarUrl'
import fetchDiscordUser from './fetchDiscordUser'

const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGODB_DB_NAME,
    collections: {
      Users: process.env.MONGODB_USERS_COLLECTION,
    },
  }),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
      async profile(profile) {
        const { id, email, username, avatar } = profile as DiscordProfile

        const user = {
          id,
          email,
          username,
          avatar: discordAvatarUrl(id, avatar),
          discordId: id,
          legacy: false,
        }

        return user
      },
    }),
  ],
  callbacks: {
    async signIn({ profile, account }) {
      if (profile === undefined) return false

      /** Create database variables. */
      const client = await clientPromise
      const db = client.db(process.env.MONGODB_DB_NAME)
      const usersCollection = db.collection<DBUser>(process.env.MONGODB_USERS_COLLECTION)

      /** Store fresh information about the user from Discord's API. */
      try {
        const discordUser = await fetchDiscordUser(account?.access_token)
        if (discordUser) {
          await usersCollection.updateOne(
            { discordId: discordUser.id, legacy: false },
            {
              $set: {
                username: discordUser.username,
                avatar: discordAvatarUrl(discordUser.id, discordUser.avatar),
              },
            }
          )
        }
      } catch (error) {
        console.log(
          `There was an error fetching up to date profile information for user ${profile.id}`,
          error
        )
      }

      /** Allow the user to sign in if they are found or they have a legacy account. */
      const dbUser = await usersCollection.findOne({ discordId: profile.id })
      if (dbUser !== null) return true

      /** Allow the first user to sign in. */
      const dbUsers = await usersCollection.count({})
      if (dbUsers < 1) return true

      /** Deny otherwise. */
      return false
    },
    session: async ({ session, user }) => {
      const { id, username, avatar, email, discordId, legacy } = user

      return {
        user: {
          id,
          username,
          avatar,
          email: email ?? null,
          discordId,
          legacy,
        },
        expires: session.expires,
      }
    },
  },
  pages: {
    signIn: '/auth/signin',
    signOut: '/auth/signout',
    error: '/auth/error',
    newUser: '/initiation',
  },
}

export default authOptions
