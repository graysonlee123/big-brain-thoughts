import { NextApiHandler } from 'next'
import { getServerSession } from 'next-auth/next'
import { ObjectId } from 'mongodb'
import authOptions from '@lib/authOptions'
import queryUser from '@lib/queryUser'
import clientPromise from '@lib/db'

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

      /** Respond to the client. */
      const reply: APIResponse = {
        ok: true,
        msg: 'Quote added succesfully.',
        data: quote,
      }

      res.json(reply)
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ ok: false, msg: 'There was an issue adding that quote.' } as APIResponse)
    }
  } else {
    try {
      const client = await clientPromise
      const db = await client.db(dbName)

      const data = await db.collection<Conversation>('quotes').find({}).toArray()
      const conversations: Conversation[] = data.map(({ _id, quotes, submitter, date_time }) => ({
        _id,
        quotes,
        submitter,
        date_time,
      }))

      res.json({ ok: true, msg: 'Found quotes succesfully.', data: conversations } as APIResponse)
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ ok: false, msg: 'There was an issue getting the quotes.' } as APIResponse)
    }
  }
}

export default handler
