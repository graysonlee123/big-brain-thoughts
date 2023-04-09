declare module globalThis {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

interface APIResponse<T> {
  ok: boolean
  data: T
  msg?: string
}

interface DatabaseUser {
  _id: import('mongodb').ObjectId
  name: string
  email: string
  image: string
}

interface Quote {
  speaker_id: import('mongodb').ObjectId
  content: string
}

interface Conversation {
  _id: import('mongodb').ObjectId
  submitter_id: import('mongodb').ObjectId
  quotes: Quote[]
  date_time: number
}

interface ExpandedQuote extends Quote {
  speaker_data: DatabaseUser
}

interface ExpandedConversation extends Conversation {
  submitter_data: DatabaseUser
  quotes: ExpandedQuote[]
}
