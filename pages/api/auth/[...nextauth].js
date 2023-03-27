import NextAuth from 'next-auth'
import DiscordProvider from 'next-auth/providers/discord'
import { MongoDBAdapter } from '@next-auth/mongodb-adapter'
import clientPromise from '../../../utils/db'

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise, {
    databaseName: 'bbt-dev',
  }),
  providers: [
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID,
      clientSecret: process.env.DISCORD_CLIENT_SECRET,
    }),
  ],
}
export default NextAuth(authOptions)
