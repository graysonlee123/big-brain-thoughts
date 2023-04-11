import { NextApiHandler } from 'next'
import { getServerSession, User } from 'next-auth'
import authOptions from '@lib/authOptions'
import clientPromise from '@lib/db'
import createApiResponse from '@lib/createApiResponse'

const dbName = process.env.MONGOD_DB_NAME

if (undefined === dbName) {
  throw new Error('Invalid / Missing environment variable: "MONGOD_DB_NAME"')
}

const handler: NextApiHandler<APIResponse<unknown>> = async function (req, res) {
  const session = await getServerSession(req, res, authOptions)

  if (null === session) {
    res.status(401).end()
    return
  }

  if (req.method === 'GET') {
    try {
      /** Get the DB connection. */
      const client = await clientPromise
      const db = client.db(dbName)

      /** Grab the users collection. */
      const users = await db.collection<User>('users').find({}).toArray()

      /** Reply to the client. */
      res.json(createApiResponse(true, users, 'Found users succesfully.'))
    } catch (error) {
      console.error(error)
      res.status(500).json(createApiResponse(false, error, 'There was an issue getting the users.'))
    }
  } else {
    res
      .status(404)
      .json(createApiResponse(false, null, `There is no ${req.method} method for this route.`))
    return
  }
}

export default handler
