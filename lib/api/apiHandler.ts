import { NextApiRequest, NextApiResponse } from 'next'
import { Session } from 'next-auth'
import createApiResponse from '@lib/createApiResponse'
import errorHandler from './errorHandler'
import requireSession from './requireSession'

export type ApiHandler = (
  req: NextApiRequest,
  res: NextApiResponse<APIResponse<unknown>>,
  session: Session | null
) => void

export interface ApiHandlerMethods {
  [key: string]: {
    handler: ApiHandler
    sessionRequired?: boolean
  }
}

/**
 * Handles routes for our API.
 * @param methods An object that contains keys representing request methods and their corresponding route handlers.
 * @returns Our function to pass to Next.js to handle the route.
 */
const apiHandler = (methods: ApiHandlerMethods) => {
  return async (req: NextApiRequest, res: NextApiResponse<APIResponse<unknown>>) => {
    const method = req.method?.toLowerCase() as string

    /**
     * If there is no method for the route.
     */
    if (methods[method] === undefined) {
      res
        .status(405)
        .json(createApiResponse(false, null, `There is no ${req.method} method for this route.`))
      return
    }

    /**
     * Try / catch the code for the route.
     */
    try {
      let session: Session | null = null

      /**
       * Run our auth middleware. This will throw an error if no session is found.
       */
      if (methods[method].sessionRequired === true) {
        session = await requireSession(req, res)
      }

      /**
       * Run our route and method handler.
       */
      await methods[method].handler(req, res, session)
    } catch (error) {
      errorHandler(error, res)
    }
  }
}

export default apiHandler
