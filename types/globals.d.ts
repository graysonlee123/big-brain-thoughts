declare module globalThis {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

interface APIResponse<T = unknown> {
  ok: boolean
  msg?: string
  data?: T
}
