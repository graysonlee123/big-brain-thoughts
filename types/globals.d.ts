type WithId = import('mongodb').WithId
type ObjectId = import('mongodb').ObjectId
type User = import('next-auth').User

/** The allowed types for an `_id` field when working with MongoDB ObjectIDs. */
type IdTypes<T> = T extends string | ObjectId ? T : never

/** Allow for caching the MongoDB client promise globally. */
var _mongoClientPromise: Promise<MongoClient> | undefined

/**
 * For pages that have auth options.
 *
 * Auth options allow me to add a "flag" to page components that
 * make it easy to elevate the conditions used for viewing pages.
 */
interface PageWithAuthOptions {
  auth: {
    required: boolean
  }
}

/** An API response should always have this shape. */
interface APIResponse<T> {
  ok: boolean
  data: T
  msg?: string
}

/** The basis for a quote. */
interface QuoteBase {
  speakerId: string
  content: string
}

/** The basic user. */
interface UserBase {
  /** Every account should have a username. */
  username: string

  /** Legacy accounts won't have an email or an avatar. */
  email: string | null
  avatar: string | null

  /** Every account will have a Discord account ID. */
  discordId: string

  /** A flag for whether the account is legacy or not. */
  legacy: boolean
}

/** A user from the database. */
interface DBUser extends UserBase {}

/** A conversation from the database. */
interface DBConvo {
  submitterId: ObjectId
  timestamp: string
  quotes: QuoteBase[]
}

/** The basis for conversation, either from the API or from an aggregation query. */
interface ConvoBase<IdType extends IdTypes<IdType> = string | ObjectId> {
  submitterId: IdType
  submitterData: { _id: IdType } & UserBase
  timestamp: string
  quotes: ({
    speakerId: IdType
    speakerData: { _id: IdType } & UserBase
  } & QuoteBase)[]
}

/**
 * A conversation expected to be returned by the server.
 *
 * All `_id` fields will be strings.
 * */
interface ApiConvo extends ConvoBase<string> {
  _id: string
}

/** A user from the API. */
interface ApiUser extends UserBase {
  _id: string
}

/** A conversation expected to be returned from an aggregation. */
interface AggregationConvo extends ConvoBase<ObjectId> {}
