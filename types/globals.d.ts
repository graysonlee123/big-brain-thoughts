declare module globalThis {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

interface APIResponse<T = any> {
  ok: boolean
  msg?: string
  data?: T
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
  speaker_data: import('next-auth').User
}

interface ExpandedConversation extends Conversation {
  submitter_data: import('next-auth').User
  quotes: ExpandedQuote[]
}
