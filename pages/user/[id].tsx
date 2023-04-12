import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import AuthedLayout from '@components/AuthedLayout'
import ConvoList from '@components/ConvoList'
import getEnvVar from '@lib/getEnvVar'
import gsspSessionApiFetch from '@lib/gsspSessionApiFetch'

interface SingleUserPageProps {
  data: Conversation[]
}

const UserPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data }) => {
  return (
    <AuthedLayout>
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <ConvoList convos={data} />
      </Container>
    </AuthedLayout>
  )
}

export const getServerSideProps: GetServerSideProps<SingleUserPageProps> = async (context) => {
  const id = context.query.id as string

  return await gsspSessionApiFetch<SingleUserPageProps['data']>(
    context,
    `${getEnvVar('API_URL')}/api/convos/user/${id}`
  )
}

export default UserPage
