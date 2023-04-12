import { ObjectId } from 'mongodb'
import createApiResponse from '@lib/createApiResponse'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'
import getEnvVar from '@lib/getEnvVar'

/**
 * Gets conversations by a user's id.
 * @returns An array of conversations, or `null` if the user is not found.
 */
const get: ApiHandler<Conversation[] | null> = async (req, res) => {
  const id = req.query.id as string

  /** Make sure that the user exists. */
  const usersCollection = await getDbCollection(getEnvVar('MONGODB_USERS_COLLECTION'))
  const user = await usersCollection.findOne({ _id: new ObjectId(id) })

  if (null === user) {
    res.status(404).json(createApiResponse(false, null, 'No user by that ID was found.'))
    return
  }

  /** Get the convos. */
  const convosCollection = await getDbCollection(getEnvVar('MONGODB_CONVERSATIONS_COLLECTION'))
  const conversations = (await convosCollection
    .aggregate([
      {
        $match: {
          'quotes.speaker_id': new ObjectId(id),
        },
      },
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

  res.json(createApiResponse(true, conversations, 'Found quotes based on that user.'))
}

export default apiHandler({
  get: {
    sessionRequired: true,
    handler: get,
  },
})
