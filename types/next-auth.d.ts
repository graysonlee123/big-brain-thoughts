import NextAuth, { ISODateString } from 'next-auth'
import { DiscordProfile } from 'next-auth/providers/discord'

declare module 'next-auth' {
  interface User {
    /** Every account should have a username. */
    username: string

    /** Legacy accounts won't have an email or an avatar. */
    email: string | null
    avatar: string | null

    /** Every account will have a Discord account ID. */
    discordId: string

    /** A flag for whether the account is legacy or not. */
    legacy: boolean
  }

  interface Session {
    user: {
      username: string
      discordId: string
      avatar: string | null
      email: string | null
    }
  }

  interface Profile extends DiscordProfile {}
}
