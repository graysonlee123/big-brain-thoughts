import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import AuthedLayout from '@components/AuthedLayout'
import Convo from '@components/Convo'
import getEnvVar from '@lib/getEnvVar'
import gsspSessionApiFetch from '@lib/gsspSessionApiFetch'

interface SingleQuotePageProps {
  data: Conversation
}

const SingleQuotePage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  data,
}) => {
  return (
    <AuthedLayout>
      <Container maxWidth="sm" sx={{ my: 8 }}>
        <Convo convo={data} />
      </Container>
    </AuthedLayout>
  )
}

export const getServerSideProps: GetServerSideProps<SingleQuotePageProps> = async (context) => {
  const id = context.query.id as string

  return await gsspSessionApiFetch<SingleQuotePageProps['data']>(
    context,
    `${getEnvVar('NEXTAUTH_URL')}/api/quotes/${id}`
  )
}

export default SingleQuotePage
