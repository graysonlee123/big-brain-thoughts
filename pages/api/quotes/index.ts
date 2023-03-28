import { NextApiHandler } from 'next'
import clientPromise from 'lib/db'
import { getServerSession } from 'next-auth/next'
import authOptions from '@lib/authOptions'
import { ObjectId } from 'mongodb'

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
      const client = await clientPromise
      const db = await client.db(dbName)

      const payload: Conversation = {
        submitter: new ObjectId(session.user.id),
        conversation: [
          {
            content: req.body.title,
            speaker: new ObjectId(session.user.id),
          },
        ],
        date_time: '12345623',
      }

      const quote = await db.collection('quotes').insertOne(payload)

      res.json({
        ok: true,
        msg: 'Quote added succesfully.',
        data: quote,
      } as APIResponse)
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

      const quotes = await db.collection('quotes').find({}).toArray()

      res.json({ ok: true, msg: 'Found quotes succesfully.', data: quotes } as APIResponse)
    } catch (error) {
      console.error(error)
      res
        .status(500)
        .json({ ok: false, msg: 'There was an issue getting the quotes.' } as APIResponse)
    }
  }
}

export default handler
