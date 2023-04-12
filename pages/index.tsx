import type { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { Container } from '@mui/material'
import ConvoList from '@components/ConvoList'
import AuthedLayout from '@components/AuthedLayout'
import authOptions from '@lib/authOptions'
import getEnvVar from '@lib/getEnvVar'

interface HomePageProps {
  convos: Conversation[]
}

const HomePage: NextPage<HomePageProps> = ({ convos }) => {
  return (
    <AuthedLayout>
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <ConvoList convos={convos} />
      </Container>
    </AuthedLayout>
  )
}

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions)
  const baseURL = getEnvVar('NEXTAUTH_URL')
  let convos: Conversation[] = []

  if (session) {
    try {
      const res = await fetch(`${baseURL}/api/quotes`, {
        headers: { Cookie: req.headers.cookie ?? '' },
      })
      const json: APIResponse<Conversation[]> = await res.json()

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

export default HomePage
