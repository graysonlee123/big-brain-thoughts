import createApiResponse from '@lib/createApiResponse'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'
import getEnvVar from '@lib/getEnvVar'
import { User } from 'next-auth'

/**
 * Gets all of the users.
 * @returns An array of users.
 */
const get: ApiHandler<User[]> = async (req, res) => {
  /** Get the users collection. */
  const usersCollection = await getDbCollection(getEnvVar('MONGODB_USERS_COLLECTION'))

  /** Grab the users collection. */
  const users = (await usersCollection.find({}).toArray()) as User[]

  /** Reply to the client. */
  res.json(createApiResponse(true, users, 'Found users succesfully.'))
}

export default apiHandler({
  get: {
    handler: get,
    sessionRequired: true,
  },
})
