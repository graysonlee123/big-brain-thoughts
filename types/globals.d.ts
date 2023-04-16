declare module globalThis {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

interface PageWithAuthOptions {
  auth: {
    required: boolean
  }
}

interface APIResponse<T> {
  ok: boolean
  data: T
  msg?: string
}

interface ConversationBase {
  submitterId: string
  quotes: {
    speakerId: string
    content: string
  }[]
  timestamp: number
}

interface Conversation extends ConversationBase {
  _id: string
  submitterData: import('next-auth').User
  quotes: (ConversationBase['quotes'][number] & { speakerData: import('next-auth').User })[]
}

interface UserWithConvos {
  convos: Conversation[]
  user: User
}
