import { GetServerSideProps, NextPage } from 'next'
import { getServerSession } from 'next-auth'
import { Container } from '@mui/material'
import AuthedLayout from '@components/AuthedLayout'
import Convo from '@components/Convo'
import authOptions from '@lib/authOptions'
import getEnvVar from '@lib/getEnvVar'

interface SingleQuotePageProps {
  convo: Conversation
}

const SingleQuotePage: NextPage<SingleQuotePageProps> = ({ convo }) => {
  return (
    <AuthedLayout>
      <Container maxWidth="sm" sx={{ my: 8 }}>
        <Convo convo={convo} />
      </Container>
    </AuthedLayout>
  )
}

export const getServerSideProps: GetServerSideProps<SingleQuotePageProps> = async ({
  req,
  res,
  query,
}) => {
  const session = await getServerSession(req, res, authOptions)
  const baseURL = getEnvVar('NEXTAUTH_URL')
  const id = query.id as string
  let convo

  if (session) {
    try {
      const res = await fetch(`${baseURL}/api/quotes/${id}`, {
        headers: { Cookie: req.headers.cookie ?? '' },
      })
      const json: APIResponse<Conversation | null> = await res.json()

      convo = json.data
    } catch (error) {
      console.error(error)
      return {
        notFound: true,
      }
    }
  }

  if (!convo) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      convo,
      session,
    },
  }
}

export default SingleQuotePage
