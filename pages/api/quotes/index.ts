import { NextApiHandler } from 'next'
import clientPromise from 'utils/db'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '../auth/[...nextauth]'

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

  try {
    const client = await clientPromise
    const db = await client.db(dbName)

    const quotes = await db.collection('quotes').find({}).toArray()

    res.json(quotes)
  } catch (error) {
    console.error(error)
  }
}

export default handler
