import DiscordProvider from 'next-auth/providers/discord'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from './db'

const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: process.env.MONGOD_DB_NAME,
  }),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID ?? '',
      clientSecret: process.env.DISCORD_CLIENT_SECRET ?? '',
    }),
  ],
}

export default authOptions
