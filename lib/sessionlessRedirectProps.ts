import { GetServerSidePropsContext, Redirect } from 'next'
import { getServerSession } from 'next-auth'
import authOptions from './authOptions'

/**
 * Returns a redirect object to the signin page if the user has no valid session.
 * @param context The GetServerSideProps context parameter.
 * @returns The redirect object, or `null` if the session was found.
 */
const sessionlessRedirectProps = async (
  context: GetServerSidePropsContext
): Promise<{ redirect: Redirect } | null> => {
  const { req, res } = context
  const session = await getServerSession(req, res, authOptions)

  if (session === null) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  return null
}

export default sessionlessRedirectProps
