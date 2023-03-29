import { User } from 'next-auth'
import { Db } from 'mongodb'

/**
 * Gets the user, including their ID, from the database.
 * @param db The database connection.
 * @param email The user email to lookup.
 * @returns A promise that resolves with user data.
 */
function queryUser(db: Db, email: string) {
  return new Promise<User>(async (resolve, reject) => {
    let user = null

    try {
      user = await db.collection('users').findOne({ email: email })
    } catch (error) {
      reject(new Error('There was an issue looking for users in the database.'))
      return
    }

    if (user) {
      const payload: User = {
        id: user._id.toString(),
        email: user.email,
        image: user.image,
        name: user.name,
      }

      resolve(payload)
    } else {
      reject(new Error('Could not find a user based on that email.'))
    }
  })
}

export default queryUser
