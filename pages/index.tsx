import type { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import ConvoList from '@components/ConvoList'
import AddQuote from '@components/AddQuote'
import SelectUser from '@components/SelectUser'
import AuthedLayout from '@components/AuthedLayout/AuthedLayout'
import authOptions from '@lib/authOptions'
import { Container } from '@mui/material'

interface HomePageProps {
  convos: ExpandedConversation[]
}

const Home: NextPage<HomePageProps> = ({ convos }) => {
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
  const baseURL = process.env.NEXTAUTH_URL
  let convos: ExpandedConversation[] = []

  if (!baseURL) console.warn('No `NEXTAUTH_URL` environment variable!')

  if (session) {
    try {
      const res = await fetch(`${baseURL}/api/quotes`, {
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

export default Home
