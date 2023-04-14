import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import ConvoList from '@components/ConvoList'
import AuthedLayout from '@components/AuthedLayout'
import getEnvVar from '@lib/getEnvVar'
import sessionlessRedirectProps from '@lib/sessionlessRedirectProps'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import ErrorView from '@components/ErrorView'

interface HomePageProps extends PropsFromFetchResult<Conversation[]> {}

const HomePage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  error,
  data,
}) => {
  if (error) return <ErrorView message={error} />

  if (data)
    return (
      <AuthedLayout>
        <Container maxWidth="lg" sx={{ my: 8 }}>
          <ConvoList convos={data} />
        </Container>
      </AuthedLayout>
    )

  return null
}

export const getServerSideProps: GetServerSideProps<HomePageProps> = async (context) => {
  const { req } = context
  const redirect = await sessionlessRedirectProps(context)

  if (redirect !== null) {
    return redirect
  }

  const url = `${getEnvVar('API_URL')}/api/convos`
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }

  return await propsFromFetch(url, options)
}

export default HomePage
