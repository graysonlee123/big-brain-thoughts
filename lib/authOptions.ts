import { AuthOptions } from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from './db'
import getEnvVar from './getEnvVar'

const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: getEnvVar('MONGODB_DB_NAME'),
  }),
  providers: [
    DiscordProvider({
      clientId: getEnvVar('DISCORD_CLIENT_ID'),
      clientSecret: getEnvVar('DISCORD_CLIENT_SECRET'),
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      if (profile === undefined) return false

      user.legacy = false
      user.discord_id = profile.id

      /** Create database variables. */
      const client = await clientPromise
      const db = client.db(getEnvVar('MONGODB_DB_NAME'))
      const usersCollection = db.collection(getEnvVar('MONGODB_USERS_COLLECTION'))

      /** Allow the user to sign in if they are found or they have a legacy account. */
      const dbUser = await usersCollection.findOne({ discord_id: profile?.id })
      if (dbUser !== null) return true

      /** Allow the first user to sign in. */
      const dbUsers = await usersCollection.find({}).toArray()
      if (dbUsers.length < 1) return true

      /** Deny otherwise. */
      return false
    },
  },
  pages: {
    newUser: '/initiation',
  },
}

export default authOptions
