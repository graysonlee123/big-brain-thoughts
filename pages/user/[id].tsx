import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import AuthedLayout from '@components/AuthedLayout'
import ConvoList from '@components/ConvoList'
import authOptions from '@lib/authOptions'
import { Container } from '@mui/material'

interface UserPageProps {
  convos: ExpandedConversation[]
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
  const baseURL = process.env.NEXTAUTH_URL
  const id = query.id
  let convos: ExpandedConversation[] = []

  if (!baseURL) console.warn('No `NEXTAUTH_URL` environment variable!')

  if (session) {
    try {
      const res = await fetch(`${baseURL}/api/quotes/user/${id}`, {
        headers: { Cookie: req.headers.cookie ?? '' },
      })
      const json: APIResponse<ExpandedConversation[]> = await res.json()

      convos = json.data
    } catch (error) {
      console.error(error)
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
