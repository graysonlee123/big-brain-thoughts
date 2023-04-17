import NextAuth, { ISODateString } from 'next-auth'
import { DiscordProfile } from 'next-auth/providers/discord'

declare module 'next-auth' {
  interface User extends UserBase {}

  interface Session {
    user: UserBase
  }

  interface Profile extends DiscordProfile {}
}
