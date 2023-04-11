import DiscordProvider from 'next-auth/providers/discord'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from './db'
import { AuthOptions } from 'next-auth'

const authOptions: AuthOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGOD_DB_NAME,
  }),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
  ],
  callbacks: {
    async signIn({ user, profile }) {
      const allowedIds = (process.env.DISCORD_USER_IDS ?? '').trim().split(',')

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
