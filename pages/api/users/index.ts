import clientPromise from '@lib/db'
import createApiResponse from '@lib/createApiResponse'
import getDbName from '@lib/api/getDbName'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'

const dbName = getDbName()

const get: ApiHandler = async (req, res) => {
  /** Get the DB connection. */
  const client = await clientPromise
  const db = client.db(dbName)

  /** Grab the users collection. */
  const users = await db.collection('users').find({}).toArray()

  /** Reply to the client. */
  res.json(createApiResponse(true, users, 'Found users succesfully.'))
}

export default apiHandler({
  get: {
    handler: get,
    sessionRequired: true,
  },
})
