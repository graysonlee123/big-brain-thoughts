import createApiResponse from '@lib/createApiResponse'
import { NextApiResponse } from 'next'
import ApiError from './apiError'
import ApiAuthError from './apiAuthError'

/**
 * Handles errors for the API routes.
 * @param error The error instance itself.
 * @param res The response.
 */
const errorHandler = (error: unknown, res: NextApiResponse<APIResponse<unknown>>) => {
  if (error instanceof ApiError) {
    console.error(error)
    res.status(error.status).json(createApiResponse(false, null, error.message))
    return
  }

  if (error instanceof ApiAuthError) {
    res.status(error.status).json(createApiResponse(false, null, error.message))
    return
  }

  console.error(error)
  res.status(500).json(createApiResponse(false, null, 'There was an error with that request.'))
  return
}

export default errorHandler
