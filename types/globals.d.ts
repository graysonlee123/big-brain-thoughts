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
  submitter: import('mongodb')
  conversation: Quote[]
  date_time: string
}
