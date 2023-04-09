import { NextApiHandler } from 'next'
import { getServerSession } from 'next-auth'
import { ObjectId } from 'mongodb'
import authOptions from '@lib/authOptions'
import createApiResponse from '@lib/createApiResponse'
import clientPromise from '@lib/db'

const dbName = process.env.MONGOD_DB_NAME

if (undefined === dbName) {
  throw new Error('Invalid / Missing environment variable: "MONGOD_DB_NAME"')
}

const handler: NextApiHandler = async (req, res) => {
  const session = await getServerSession(req, res, authOptions)

  if (null === session) {
    res.status(401).json(createApiResponse(false, null, 'No session found.'))
    return
  }

  if (req.method === 'GET') {
    try {
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
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json(createApiResponse(false, error, 'There was an issue getting the quotes.'))
    }
    return
  } else {
    res
      .status(404)
      .json(createApiResponse(false, null, `There is no ${req.method} method for this route.`))
    return
  }
}

export default handler
