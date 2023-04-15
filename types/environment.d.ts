declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_API_URL: string
      NEXTAUTH_SECRET: string
      NEXTAUTH_URL: string
      DISCORD_CLIENT_ID: string
      DISCORD_CLIENT_SECRET: string
      MONGODB_URI: string
      MONGODB_DB_NAME: string
      MONGODB_USERS_COLLECTION: string
      MONGODB_CONVERSATIONS_COLLECTION: string
    }
  }
}

export {}
