import ApiAuthError from '@lib/api/apiAuthError'
import apiHandler, { ApiHandler } from '@lib/api/apiHandler'
import getDbCollection from '@lib/api/getDbCollection'
import createApiResponse from '@lib/createApiResponse'

/**
 * Replaces a legacy user with a logged in user.
 * @returns `true` if success, `null` otherwise.
 */
const patch: ApiHandler<true | null> = async (req, res, session) => {
  /** Throw an auth error if there is no session. */
  if (session === null) {
    throw new ApiAuthError(req)
  }

  /** Get the current user's Discord ID. */
  const userCollection = await getDbCollection<DBUser>(process.env.MONGODB_USERS_COLLECTION)
  const user = await userCollection.findOne({ discordId: session.user.discordId })

  if (user === null) {
    res.status(500).json(createApiResponse(false, null, 'Could not find the user to initiate.'))
    return
  }

  /** Find a legacy user based on the Discord IDs. */
  const matchedLegacyUser = await userCollection.findOne({
    $and: [{ legacy: true }, { discordId: user.discordId }],
  })

  if (matchedLegacyUser === null) {
    res.status(404).json(createApiResponse(false, null, 'There was no legacy user to replace.'))
    return
  }

  /** Perform the surgery. */
  const convosCollection = await getDbCollection<DBConvo>(
    process.env.MONGODB_CONVERSATIONS_COLLECTION
  )
  convosCollection.updateMany(
    {
      $or: [{ submitterId: matchedLegacyUser._id }, { 'quotes.speakerId': matchedLegacyUser._id }],
    },
    { $set: { submitterId: user._id, 'quotes.$[elem].speakerId': user._id } },
    { arrayFilters: [{ 'elem.speakerId': matchedLegacyUser._id }] }
  )

  /** Delete the old user. */
  await userCollection.deleteOne({ _id: matchedLegacyUser._id })

  /** Reply to the client. */
  res.json(createApiResponse(true, true, 'Succesfully updated legacy users.'))
}

export default apiHandler({
  patch: {
    handler: patch,
    sessionRequired: true,
  },
})
