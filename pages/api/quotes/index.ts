import { InsertOneResult, ObjectId } from 'mongodb'
import queryUser from '@lib/queryUser'
import createApiResponse from '@lib/createApiResponse'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import ApiAuthError from '@lib/api/apiAuthorizationError'
import getDbCollection from '@lib/api/getDbCollection'
import { User } from 'next-auth'
import getEnvVar from '@lib/getEnvVar'

/**
 * Gets all of the conversations.
 * @returns An array of conversations.
 */
const get: ApiHandler<Conversation[]> = async (req, res) => {
  const quotesCollection = await getDbCollection(getEnvVar('MONGODB_QUOTES_COLLECTION'))
  const conversations = (await quotesCollection
    .aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'submitter_id',
          foreignField: '_id',
          as: 'submitter_data',
        },
      },
      {
        $unwind: '$submitter_data',
      },
      {
        $unwind: '$quotes',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'quotes.speaker_id',
          foreignField: '_id',
          as: 'quotes.speaker_data',
        },
      },
      {
        $unwind: '$quotes.speaker_data',
      },
      {
        $group: {
          _id: '$_id',
          submitter_data: { $first: '$submitter_data' },
          date_time: { $first: '$date_time' },
          quotes: { $push: '$quotes' },
        },
      },
      {
        $sort: { date_time: -1 },
      },
    ])
    .toArray()) as Conversation[]

  /** Reply with the conversations. */
  res.json(createApiResponse(true, conversations, 'Found quotes succesfully.'))
}

/**
 * Post a new conversation.
 * @returns The new conversation.
 */
const post: ApiHandler<InsertOneResult> = async (req, res, session) => {
  /** Throw an auth error if no session was found. */
  if (session === null) {
    throw new ApiAuthError(req)
  }

  /** Get the quotes collection. */
  const quotesCollection = await getDbCollection('quotes')

  /** Get the user based on the session. */
  const user = (await queryUser(session.user?.email ?? '')) as User

  /** Create a payload for the database. */
  const payload: ConversationBase = {
    submitter_id: new ObjectId(user._id),
    quotes: [
      {
        content: req.body.title,
        speaker_id: new ObjectId(user._id),
      },
    ],
    date_time: Date.now(),
  }

  /** Submit to the database. */
  const result = await quotesCollection.insertOne(payload)

  /** Reply to the client. */
  res.json(createApiResponse(true, result, 'Quote added succesfully.'))
}

export default apiHandler({
  get: {
    handler: get,
    sessionRequired: true,
  },
  post: {
    handler: post,
    sessionRequired: true,
  },
})
