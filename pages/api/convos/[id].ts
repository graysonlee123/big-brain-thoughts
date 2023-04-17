import { ObjectId } from 'mongodb'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'
import createApiResponse from '@lib/createApiResponse'

/**
 * Gets a conversation by id.
 * @returns A conversation, or `null` if the conversation is not found.
 */
const get: ApiHandler<AggregationConvo | null> = async (req, res) => {
  const id = req.query.id as string

  /** Find the conversation. */
  const convosCollection = await getDbCollection<DBConvo>(
    process.env.MONGODB_CONVERSATIONS_COLLECTION
  )
  const convos = await convosCollection
    .aggregate<AggregationConvo>([
      {
        $match: {
          _id: new ObjectId(id),
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
    ])
    .toArray()

  if (convos.length === 0) {
    res.status(404).json(createApiResponse(false, null, 'Could not find that quote.'))
    return
  }

  res.json(createApiResponse(true, convos[0], 'Found the quote.'))
}

export default apiHandler({
  get: {
    handler: get,
    sessionRequired: true,
  },
})
