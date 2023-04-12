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

      const client = await clientPromise
      const db = client.db(getEnvVar('MONGODB_DB_NAME'))
      const usersCollection = db.collection(getEnvVar('MONGODB_USERS_COLLECTION'))

      const dbUser = await usersCollection.findOne({ discord_id: profile?.id })
      if (dbUser === null) return false

      user.legacy = false
      user.discord_id = profile.id

      return true
    },
  },
  pages: {
    newUser: '/initiation',
  },
}

export default authOptions
