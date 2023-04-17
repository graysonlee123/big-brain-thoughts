import { ObjectId } from 'mongodb'
import createApiResponse from '@lib/createApiResponse'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'

/**
 * Gets conversations by a user's id.
 * @returns An array of conversations, or `null` if the user is not found.
 */
const get: ApiHandler<{ convos: AggregationConvo[]; user: DBUser } | null> = async (req, res) => {
  const id = req.query.id as string

  /** Make sure that the user exists. */
  const usersCollection = await getDbCollection<DBUser>(process.env.MONGODB_USERS_COLLECTION)
  const user = await usersCollection.findOne({ _id: new ObjectId(id) })

  if (null === user) {
    res.status(404).json(createApiResponse(false, null, 'No user by that ID was found.'))
    return
  }

  /** Get the convos. */
  const convosCollection = await getDbCollection<DBConvo>(
    process.env.MONGODB_CONVERSATIONS_COLLECTION
  )
  const convos = await convosCollection
    .aggregate<AggregationConvo>([
      {
        $match: {
          'quotes.speakerId': new ObjectId(id),
        },
      },
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
          submitterData: { $first: '$submitterData' },
          timestamp: { $first: '$timestamp' },
          quotes: { $push: '$quotes' },
        },
      },
      {
        $sort: { timestamp: -1 },
      },
    ])
    .toArray()

  res.json(createApiResponse(true, { convos, user }, 'Found quotes based on that user.'))
}

export default apiHandler({
  get: {
    sessionRequired: true,
    handler: get,
  },
})
