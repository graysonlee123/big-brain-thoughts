import { GetServerSidePropsContext, GetServerSidePropsResult } from 'next'
import { Session, getServerSession } from 'next-auth'
import authOptions from './authOptions'

/**
 * Will always return the passsed in type.
 *
 * This function requires a session. If no session is found,
 * the user will be redirected to the login page. If there is
 * an error getting the requested content, determined by the
 * fetch response status code, the resource will be deemed
 * not found.
 */
const gsspSessionApiFetch = async <T>(
  context: GetServerSidePropsContext,
  url: string
): Promise<GetServerSidePropsResult<{ session: Session | null; data: T }>> => {
  const { req, res } = context
  const session = await getServerSession(req, res, authOptions)
  let data: T

  if (!session) {
    return {
      redirect: { destination: '/api/auth/signin', permanent: false },
    }
  }

  try {
    const options = {
      headers: { Cookie: req.headers.cookie ?? '' },
    }
    const res = await fetch(url, options)

    if (!res.ok) {
      return {
        notFound: true,
      }
    }

    const json: APIResponse<T> = await res.json()

    data = json.data
  } catch (error) {
    console.error(error)
    return {
      notFound: true,
    }
  }

  return {
    props: {
      session,
      data,
    },
  }
}

export default gsspSessionApiFetch
