import { NextApiHandler } from 'next'
import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'
import authOptions from '@lib/authOptions'
import queryUser from '@lib/queryUser'
import clientPromise from '@lib/db'
import createApiResponse from '@lib/createApiResponse'

const dbName = process.env.MONGOD_DB_NAME

if (undefined === dbName) {
  throw new Error('Invalid / Missing environment variable: "MONGOD_DB_NAME"')
}

const handler: NextApiHandler = async function (req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (null === session) {
    res.status(401).end()
    return
  }

  if (req.method === 'POST') {
    try {
      /** Get the DB connection. */
      const client = await clientPromise
      const db = await client.db(dbName)

      /** Get the user based on the session. */
      const user = await queryUser(db, session.user?.email ?? '')

      /** Create a payload for the database. */
      const payload: Omit<Conversation, '_id'> = {
        submitter: new ObjectId(user.id),
        quotes: [
          {
            content: req.body.title,
            speaker: new ObjectId(user.id),
          },
        ],
        date_time: Date.now(),
      }

      /** Submit to the database. */
      const quote = await db.collection<Omit<Conversation, '_id'>>('quotes').insertOne(payload)

      /** Reply to the client. */
      res.json(createApiResponse(true, quote, 'Quote added succesfully.'))
    } catch (error) {
      console.error(error)
      res.status(500).json(createApiResponse(false, error, 'There was an issue adding that quote.'))
    }
  } else {
    try {
      /** Get the DB connection. */
      const client = await clientPromise
      const db = await client.db(dbName)

      /** Get the conversations. */
      const data = await db.collection<Conversation>('quotes').find({}).toArray()
      const conversations: Conversation[] = data.map(({ _id, quotes, submitter, date_time }) => ({
        _id,
        quotes,
        submitter,
        date_time,
      }))

      /** Reply with the conversations. */
      res.json(createApiResponse(true, conversations, 'Found quotes succesfully.'))
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json(createApiResponse(false, error, 'There was an issue getting the quotes.'))
    }
  }
}

export default handler
