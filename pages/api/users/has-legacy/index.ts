import { User } from 'next-auth'
import { WithId } from 'mongodb'
import ApiAuthError from '@lib/api/apiAuthError'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'
import createApiResponse from '@lib/createApiResponse'
import getEnvVar from '@lib/getEnvVar'

/**
 * Checks to see if a user has a legacy account.
 * @returns The legacy user, or `null` if none was found.
 */
const get: ApiHandler = async (req, res, session) => {
  /** Throw an auth error if there is no session. */
  if (session === null) {
    throw new ApiAuthError(req)
  }

  /** Get the current user. */
  const usersCollection = await getDbCollection(getEnvVar('MONGODB_USERS_COLLECTION'))
  const user = (await usersCollection.findOne({
    discordId: session.user.discordId,
  })) as WithId<User>

  if (user === null) {
    res
      .status(400)
      .json(createApiResponse(false, null, 'Could not find the user from their session.'))
    return
  }

  /** Find a legacy user based on the Discord IDs. */
  const matchedLegacyUser = (await usersCollection.findOne({
    $and: [{ legacy: true }, { discordId: user.discordId }],
  })) as WithId<User>

  /** Return `null` to the client. */
  if (matchedLegacyUser === null) {
    res.json(createApiResponse(true, null, 'There was no legacy user to replace.'))
    return
  }

  /** Return the legacy user to the client. */
  res.json(createApiResponse(true, matchedLegacyUser, 'Found the legacy user.'))
}

export default apiHandler({
  get: {
    handler: get,
    sessionRequired: true,
  },
})
