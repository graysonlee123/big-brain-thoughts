import { User } from 'next-auth'
import { InsertOneResult, WithId } from 'mongodb'
import createApiResponse from '@lib/createApiResponse'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import ApiAuthError from '@lib/api/apiAuthError'
import getDbCollection from '@lib/api/getDbCollection'
import getEnvVar from '@lib/getEnvVar'

/**
 * Gets all of the conversations.
 * @returns An array of conversations.
 */
const get: ApiHandler<Conversation[]> = async (req, res) => {
  const convosCollection = await getDbCollection(getEnvVar('MONGODB_CONVERSATIONS_COLLECTION'))
  const conversations = (await convosCollection
    .aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'submitterId',
          foreignField: '_id',
          as: 'submitterData',
        },
      },
      {
        $unwind: '$submitterData',
      },
      {
        $unwind: '$quotes',
      },
      {
        $lookup: {
          from: 'users',
          localField: 'quotes.speakerId',
          foreignField: '_id',
          as: 'quotes.speakerData',
        },
      },
      {
        $unwind: '$quotes.speakerData',
      },
      {
        $group: {
          _id: '$_id',
          submitterId: { $first: '$submitterId' },
          submitterData: { $first: '$submitterData' },
          timestamp: { $first: '$timestamp' },
          quotes: { $push: '$quotes' },
        },
      },
      {
        $sort: { timestamp: -1 },
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

  /** Get the collections. */
  const convosCollection = await getDbCollection(getEnvVar('MONGODB_CONVERSATIONS_COLLECTION'))
  const usersCollection = await getDbCollection(getEnvVar('MONGODB_USERS_COLLECTION'))

  /** Get the user based on the session. */
  const user = (await usersCollection.findOne({
    discordId: session.user.discordId,
  })) as WithId<User>

  /** Create a payload for the database. */
  const payload: ConversationBase = {
    submitterId: user._id.toString(),
    quotes: [
      {
        content: req.body.title,
        speakerId: user._id.toString(),
      },
    ],
    timestamp: Date.now(),
  }

  /** Submit to the database. */
  const result = await convosCollection.insertOne(payload)

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
