import { WithId } from 'mongodb'
import createApiResponse from '@lib/createApiResponse'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'

/**
 * Gets all of the users.
 * @returns An array of users.
 */
const get: ApiHandler<WithId<DBUser>[]> = async (req, res) => {
  /** Get the users collection. */
  const usersCollection = await getDbCollection<DBUser>(process.env.MONGODB_USERS_COLLECTION)

  /** Grab the users collection. */
  const users = await usersCollection.find({}).toArray()

  /** Reply to the client. */
  res.json(createApiResponse(true, users, 'Found users succesfully.'))
}

export default apiHandler({
  get: {
    handler: get,
    sessionRequired: true,
  },
})
