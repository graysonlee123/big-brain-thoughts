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

interface QuoteBase {
  speakerId: string
  content: string
}

interface ConversationBase {
  submitterId: string
  quotes: QuoteBase[]
  timestamp: string
}

interface Quote extends QuoteBase {
  speakerData: import('next-auth').user
}

interface Conversation extends ConversationBase {
  _id: string
  submitterData: import('next-auth').User
  quotes: Quote[]
}

interface UserWithConvos {
  convos: Conversation[]
  user: User
}
