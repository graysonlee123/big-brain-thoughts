import { NextApiRequest } from 'next'

/**
 * A simple class that helps throwing API Authentication Errors.
 */
class ApiAuthError extends Error {
  status: number
  req: NextApiRequest

  /**
   * Build a new instance.
   * @param status The HTTP status code.
   * @param message A message about what went wrong.
   */
  constructor(req: NextApiRequest, status = 401) {
    super('You are unauthorized to use that route.')

    this.status = status
    this.req = req
    Object.setPrototypeOf(this, ApiAuthError.prototype)
  }
}

export default ApiAuthError
