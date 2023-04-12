import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'
import createApiResponse from '@lib/createApiResponse'
import getEnvVar from '@lib/getEnvVar'
import { ObjectId } from 'mongodb'

/**
 * Gets a conversation by id.
 * @returns A conversation, or `null` if the conversation is not found.
 */
const get: ApiHandler<Conversation | null> = async (req, res) => {
  const id = req.query.id as string

  /** Find the conversation. */
  const convosCollection = await getDbCollection(getEnvVar('MONGODB_QUOTES_COLLECTION'))
  const convos = (await convosCollection
    .aggregate([
      {
        $match: {
          _id: new ObjectId(id),
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
    ])
    .toArray()) as Conversation[]

  if (convos.length === 0) {
    res.json(createApiResponse(false, null, 'Could not find that conversation.'))
    return
  }

  res.json(createApiResponse(true, convos[0], 'Found the conversation.'))
}

export default apiHandler({
  get: {
    handler: get,
    sessionRequired: true,
  },
})
