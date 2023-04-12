import { ObjectId } from 'mongodb'
import createApiResponse from '@lib/createApiResponse'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'

const get: ApiHandler = async (req, res) => {
  /** Grab the quotes collection. */
  const quotesCollection = await getDbCollection('quotes')

  /** Get the quotes that contain the user id from the request query. */
  const id = req.query.id as string
  const conversations = await quotesCollection
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
    .toArray()

  res.json(createApiResponse(true, conversations, 'Found quotes based on that user.'))
}

export default apiHandler({
  get: {
    sessionRequired: true,
    handler: get,
  },
})
