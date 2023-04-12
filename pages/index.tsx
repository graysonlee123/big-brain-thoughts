import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import ConvoList from '@components/ConvoList'
import AuthedLayout from '@components/AuthedLayout'
import getEnvVar from '@lib/getEnvVar'
import gsspSessionApiFetch from '@lib/gsspSessionApiFetch'

interface HomePageProps {
  data: Conversation[]
}

const HomePage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({ data }) => {
  return (
    <AuthedLayout>
      <Container maxWidth="lg" sx={{ my: 8 }}>
        <ConvoList convos={data} />
      </Container>
    </AuthedLayout>
  )
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  return await gsspSessionApiFetch<HomePageProps['data']>(
    context,
    `${getEnvVar('API_URL')}/api/convos`
  )
}

export default HomePage
