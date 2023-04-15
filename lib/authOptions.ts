import { AuthOptions } from 'next-auth'
import DiscordProvider, { DiscordProfile } from 'next-auth/providers/discord'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from './db'
import getEnvVar from './getEnvVar'
import discordAvatarUrl from './discordAvatarUrl'

const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: getEnvVar('MONGODB_DB_NAME'),
    collections: {
      Users: getEnvVar('MONGODB_USERS_COLLECTION', 'users'),
    },
  }),
  providers: [
    DiscordProvider({
      clientId: getEnvVar('DISCORD_CLIENT_ID'),
      clientSecret: getEnvVar('DISCORD_CLIENT_SECRET'),
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
    async signIn({ profile }) {
      if (profile === undefined) return false

      // TODO: Re-fetch the user's data from Discord using the access token in the `account` parameter

      /** Create database variables. */
      const client = await clientPromise
      const db = client.db(getEnvVar('MONGODB_DB_NAME'))
      const usersCollection = db.collection(getEnvVar('MONGODB_USERS_COLLECTION'))

      /** Allow the user to sign in if they are found or they have a legacy account. */
      const dbUser = await usersCollection.findOne({ discordId: profile.id })
      if (dbUser !== null) return true

      /** Allow the first user to sign in. */
      const dbUsers = await usersCollection.find({}).toArray()
      if (dbUsers.length < 1) return true

      /** Deny otherwise. */
      return false
    },
    session: async ({ session, user }) => {
      const { username, avatar, email, discordId } = user

      return {
        user: {
          username,
          avatar,
          email,
          discordId,
        },
        expires: session.expires,
      }
    },
  },
  pages: {
    // newUser: '/initiation',
  },
}

export default authOptions
