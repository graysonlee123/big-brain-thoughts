/**
 * A simple class that helps throwing API Errors.
 */
class ApiError extends Error {
  status: number

  /**
   * Build a new instance.
   * @param status The HTTP status code.
   * @param message A message about what went wrong.
   */
  constructor(status: number = 500, message?: string) {
    super(message)

    this.status = status
    Object.setPrototypeOf(this, ApiError.prototype)
  }
}

export default ApiError
