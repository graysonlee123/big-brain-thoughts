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
      const allowedIds = getEnvVar('DISCORD_USER_IDS').trim().split(',')

      /** Only allow Discord account IDs that are in the environment. */
      if (undefined === profile || -1 === allowedIds.indexOf(profile.id)) {
        return false
      }

      user.legacy = false
      user.discord_id = profile.id

      return true
    },
  },
}

export default authOptions
