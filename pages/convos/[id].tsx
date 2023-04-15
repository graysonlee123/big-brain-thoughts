import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import Convo from '@components/Convo'
import ErrorView from '@components/ErrorView'
import sessionlessRedirectProps from '@lib/sessionlessRedirectProps'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'

type Page = NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> & PageWithAuthOptions
type PageProps = PropsFromFetchResult<Conversation>

const SingleConvoPage: Page = ({ error, data }) => {
  if (error) return <ErrorView message={error} />

  if (data)
    return (
      <Container maxWidth="sm" sx={{ my: 8 }}>
        <Convo convo={data} />
      </Container>
    )

  return null
}

SingleConvoPage.auth = {
  required: true,
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { req } = context
  const redirect = await sessionlessRedirectProps(context)
  const id = context.query.id as string

  if (redirect !== null) {
    return redirect
  }

  const url = `${process.env.NEXT_PUBLIC_API_URL}/api/convos/${id}`
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }

  return await propsFromFetch(url, options)
}

export default SingleConvoPage
