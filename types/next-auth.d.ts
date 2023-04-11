import NextAuth from 'next-auth'

declare module 'next-auth' {
  interface User {
    _id: import('mongodb').ObjectId
    name: string
    email: string | null
    image: string | null
    discord_id: string | null
    legacy: boolean
    emailVerified: null
  }
}
