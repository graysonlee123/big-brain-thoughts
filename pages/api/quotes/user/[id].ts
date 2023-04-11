import { ObjectId } from 'mongodb'
import createApiResponse from '@lib/createApiResponse'
import clientPromise from '@lib/db'
import getDbName from '@lib/api/getDbName'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'

const dbName = getDbName()

const get: ApiHandler = async (req, res) => {
  /** Get the DB connection. */
  const client = await clientPromise
  const db = await client.db(dbName)

  /** Grab the quotes collection. */
  const quotesCollection = db.collection('quotes')

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
