import { WithId } from 'mongodb'
import ApiAuthError from '@lib/api/apiAuthError'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'
import createApiResponse from '@lib/createApiResponse'

/**
 * Checks to see if a user has a legacy account.
 * @returns A boolean, or `null` if there was an issue.
 */
const get: ApiHandler<boolean | null> = async (req, res, session) => {
  /** Throw an auth error if there is no session. */
  if (session === null) {
    throw new ApiAuthError(req)
  }

  /** Get the current user. */
  const usersCollection = await getDbCollection<DBUser>(process.env.MONGODB_USERS_COLLECTION)
  const user = await usersCollection.findOne({ discordId: session.user.discordId })

  if (user === null) {
    res
      .status(400)
      .json(createApiResponse(false, null, 'Could not find the user from their session.'))
    return
  }

  /** Find a legacy user based on the Discord IDs. */
  const matchedLegacyUser = await usersCollection.findOne({
    $and: [{ legacy: true }, { discordId: user.discordId }],
  })

  /** Return `false` to the client if no legacy user was found. */
  if (matchedLegacyUser === null) {
    res.json(createApiResponse(false, false, 'There was no legacy user to replace.'))
    return
  }

  /** Return `true` to the client, indicating there is a legacy user. */
  res.json(createApiResponse(true, true, 'Found the legacy user.'))
}

export default apiHandler({
  get: {
    handler: get,
    sessionRequired: true,
  },
})
