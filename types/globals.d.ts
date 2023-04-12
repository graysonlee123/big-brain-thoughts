declare module globalThis {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

interface APIResponse<T> {
  ok: boolean
  data: T
  msg?: string
}

interface ConversationBase {
  submitter_id: import('mongodb').ObjectId
  quotes: {
    speaker_id: import('mongodb').ObjectId
    content: string
  }[]
  date_time: number
}

interface Conversation extends ConversationBase {
  _id: import('mongodb').ObjectId
  submitter_data: import('next-auth').User
  quotes: (ConversationBase['quotes'][number] & { speaker_data: import('next-auth').User })[]
}
