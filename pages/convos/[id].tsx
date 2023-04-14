import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import AuthedLayout from '@components/AuthedLayout'
import Convo from '@components/Convo'
import getEnvVar from '@lib/getEnvVar'
import sessionlessRedirectProps from '@lib/sessionlessRedirectProps'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import ErrorView from '@components/ErrorView'

interface SingleConvoPageProps extends PropsFromFetchResult<Conversation> {}

const SingleConvoPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  error,
  data,
}) => {
  if (error) return <ErrorView message={error} />

  if (data)
    return (
      <AuthedLayout>
        <Container maxWidth="sm" sx={{ my: 8 }}>
          <Convo convo={data} />
        </Container>
      </AuthedLayout>
    )

  return null
}

export const getServerSideProps: GetServerSideProps<SingleConvoPageProps> = async (context) => {
  const { req } = context
  const redirect = await sessionlessRedirectProps(context)
  const id = context.query.id as string

  if (redirect !== null) {
    return redirect
  }

  const url = `${getEnvVar('API_URL')}/api/convos/${id}`
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }

  return await propsFromFetch(url, options)
}

export default SingleConvoPage
