import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import apiUrl from '@lib/api/apiUrl'
import Convo from '@components/Convo'
import ErrorView from '@components/ErrorView'

type Page = NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> & PageWithAuthOptions
type PageProps = PropsFromFetchResult<ApiConvo>

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

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, query }) => {
  const url = apiUrl(`/api/convos/${query.id}`)
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }

  return await propsFromFetch(url, options)
}

export default SingleConvoPage
