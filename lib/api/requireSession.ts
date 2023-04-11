import { NextApiRequest, NextApiResponse } from 'next'
import { getServerSession } from 'next-auth'
import authOptions from '@lib/authOptions'
import ApiAuthError from './apiAuthorizationError'

/**
 * Gets the session or throws an error if no session is found.
 * @param req The request.
 * @param res The response.
 * @returns The session.
 */
const requireSession = async (req: NextApiRequest, res: NextApiResponse) => {
  const session = await getServerSession(req, res, authOptions)

  if (null === session) {
    throw new ApiAuthError(req)
  }

  return session
}

export default requireSession
