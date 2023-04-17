import { User } from 'next-auth'
import { InsertOneResult, ObjectId, WithId } from 'mongodb'
import createApiResponse from '@lib/createApiResponse'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import ApiAuthError from '@lib/api/apiAuthError'
import getDbCollection from '@lib/api/getDbCollection'

/**
 * Gets all of the conversations.
 * @returns An array of conversations.
 */
const get: ApiHandler<Conversation[]> = async (req, res) => {
  const convosCollection = await getDbCollection(process.env.MONGODB_CONVERSATIONS_COLLECTION)
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
 * @returns The new conversation or `null` if there was an issue.
 */
const post: ApiHandler<InsertOneResult | null> = async (req, res, session) => {
  /** Throw an auth error if no session was found. */
  if (session === null) {
    throw new ApiAuthError(req)
  }

  /** Get the collections. */
  const convosCollection = await getDbCollection(process.env.MONGODB_CONVERSATIONS_COLLECTION)
  const usersCollection = await getDbCollection(process.env.MONGODB_USERS_COLLECTION)

  /** Get the user based on the session. */
  const user = (await usersCollection.findOne({
    discordId: session.user.discordId,
  })) as WithId<User> | null

  if (user === null) {
    res.status(404).json(createApiResponse(false, null, 'No current user could be determined.'))
    return
  }

  const data = JSON.parse(req.body)
  const quotes = data.quotes

  if (!Array.isArray(quotes)) {
    res.status(400).json(createApiResponse(false, null, 'Invalid data type for quotes array sent.'))
    return
  }

  if (quotes.length === 0) {
    res
      .status(400)
      .json(createApiResponse(false, null, 'An empty array was passed for the quotes.'))
    return
  }

  if (
    !quotes.every((item) => {
      if (item === null) return false
      if (typeof item !== 'object') return false
      if (!('content' in item)) return false
      if (typeof item.content !== 'string') return false
      if (item.content === '') return false
      if (!('speakerId' in item)) return false
      if (typeof item.speakerId !== 'string') return false
      if (!ObjectId.isValid(item.speakerId)) return false
      return true
    })
  ) {
    res.status(400).json(createApiResponse(false, null, 'Invalid data type for quotes array sent.'))
    return
  }

  /** Create a payload for the database. */
  const payload = {
    submitterId: user._id,
    quotes: quotes.map((quote) => ({ ...quote, speakerId: new ObjectId(quote.speakerId) })),
    timestamp: new Date().toISOString(),
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
