import { User } from 'next-auth'
import ApiAuthError from '@lib/api/apiAuthError'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'
import createApiResponse from '@lib/createApiResponse'
import getEnvVar from '@lib/getEnvVar'

/**
 * Replaces a legacy user with a logged in user.
 * @returns `null`.
 */
const get: ApiHandler = async (req, res, session) => {
  /** Throw an auth error if there is no session. */
  if (session === null) {
    throw new ApiAuthError(req)
  }

  /** Get the current user's Discord ID. */
  const userCollection = await getDbCollection(getEnvVar('MONGODB_USERS_COLLECTION'))
  const user = (await userCollection.findOne({ email: session.user?.email })) as User

  if (user === null) {
    res.status(500).json(createApiResponse(false, null, 'Could not find the user to initiate.'))
    return
  }

  const discordId = user.discord_id

  if (discordId === null) {
    res
      .status(500)
      .json(
        createApiResponse(
          false,
          null,
          'Could not complete initiation, the Discord ID for the user was null.'
        )
      )
    return
  }

  /** Find a legacy user based on the Discord IDs. */
  const matchedLegacyUser = (await userCollection.findOne({
    $and: [{ legacy: true }, { discord_id: discordId }],
  })) as User

  if (matchedLegacyUser === null) {
    res.status(404).json(createApiResponse(true, null, 'There was no legacy user to replace.'))
    return
  }

  /** Perform the surgery. */
  const convosCollection = await getDbCollection(getEnvVar('MONGODB_CONVERSATIONS_COLLECTION'))
  convosCollection.updateMany(
    {
      $or: [
        { submitter_id: matchedLegacyUser._id },
        { 'quotes.speaker_id': matchedLegacyUser._id },
      ],
    },
    {
      $set: {
        submitter_id: user._id,
        'quotes.$[elem].speaker_id': user._id,
      },
    },
    {
      arrayFilters: [{ 'elem.speaker_id': matchedLegacyUser._id }],
    }
  )

  /** Delete the old user. */
  await userCollection.deleteOne({ _id: matchedLegacyUser._id })

  /** Reply to the client. */
  res.json(createApiResponse(true, null, 'Succesfully updated legacy users.'))
}

export default apiHandler({
  get: {
    handler: get,
    sessionRequired: true,
  },
})
