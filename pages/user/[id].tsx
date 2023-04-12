import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { Container } from '@mui/material'
import AuthedLayout from '@components/AuthedLayout'
import ConvoList from '@components/ConvoList'
import authOptions from '@lib/authOptions'
import getEnvVar from '@lib/getEnvVar'

interface UserPageProps {
  convos: Conversation[]
}

const UserPage: NextPage<UserPageProps> = ({ convos }) => {
  return (
    <AuthedLayout>
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <ConvoList convos={convos} />
      </Container>
    </AuthedLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res, query }) => {
  const session = await getServerSession(req, res, authOptions)
  const baseURL = getEnvVar('NEXTAUTH_URL')
  const id = query.id as string
  let convos

  if (session) {
    try {
      const res = await fetch(`${baseURL}/api/quotes/user/${id}`, {
        headers: { Cookie: req.headers.cookie ?? '' },
      })
      const json: APIResponse<Conversation[] | null> = await res.json()

      convos = json.data
    } catch (error) {
      console.error(error)
      return {
        notFound: true,
      }
    }
  }

  if (!convos) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      convos,
      session,
    },
  }
}

export default UserPage
