import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import AuthedLayout from '@components/AuthedLayout'
import Convo from '@components/Convo'
import getEnvVar from '@lib/getEnvVar'
import gsspSessionApiFetch from '@lib/gsspSessionApiFetch'

interface SingleConvoPageProps {
  data: Conversation
}

const SingleConvoPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
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

export const getServerSideProps: GetServerSideProps<SingleConvoPageProps> = async (context) => {
  const id = context.query.id as string

  return await gsspSessionApiFetch<SingleConvoPageProps['data']>(
    context,
    `${getEnvVar('API_URL')}/api/convos/${id}`
  )
}

export default SingleConvoPage
