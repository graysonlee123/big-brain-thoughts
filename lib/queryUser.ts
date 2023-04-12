import ApiError from './api/apiError'
import getDbCollection from './api/getDbCollection'
import getEnvVar from './getEnvVar'

/**
 * Gets the user, including their ID, from the database.
 * @param db The database connection.
 * @param email The user email to lookup.
 * @returns A promise that resolves with user data.
 */
function queryUser(email: string) {
  return new Promise(async (resolve, reject) => {
    let user = null

    try {
      const usersCollection = await getDbCollection(getEnvVar('MONGODB_USERS_COLLECTION'))
      user = await usersCollection.findOne({ email })
    } catch (error) {
      throw new ApiError(500, 'There was an issue looking for users in the database.')
    }

    if (user) {
      resolve(user)
    } else {
      reject(new Error('Could not find a user based on that email.'))
    }
  })
}

export default queryUser
