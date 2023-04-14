import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import AuthedLayout from '@components/AuthedLayout'
import ConvoList from '@components/ConvoList'
import getEnvVar from '@lib/getEnvVar'
import sessionlessRedirectProps from '@lib/sessionlessRedirectProps'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import ErrorView from '@components/ErrorView'

interface SingleUserPageProps extends PropsFromFetchResult<Conversation[]> {}

const UserPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
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

export const getServerSideProps: GetServerSideProps<SingleUserPageProps> = async (context) => {
  const { req } = context
  const redirect = await sessionlessRedirectProps(context)
  const id = context.query.id as string

  if (redirect !== null) {
    return redirect
  }

  const url = `${getEnvVar('API_URL')}/api/convos/user/${id}`
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }

  return await propsFromFetch(url, options)
}

export default UserPage
