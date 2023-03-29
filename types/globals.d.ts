declare module globalThis {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

interface APIResponse<T = unknown> {
  ok: boolean
  msg?: string
  data?: T
}

interface Quote {
  content: string
  speaker: import('mongodb').ObjectId
}

interface Conversation {
  _id: import('mongodb').ObjectId
  submitter: import('mongodb').ObjectId
  quotes: Quote[]
  date_time: number
}
