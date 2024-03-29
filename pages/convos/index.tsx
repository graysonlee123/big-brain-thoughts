import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import apiUrl from '@lib/api/apiUrl'
import ErrorView from '@components/ErrorView'
import ConvoList from '@components/ConvoList'

type Page = NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> & PageWithAuthOptions
type PageProps = PropsFromFetchResult<ApiConvo[]>

const Page: Page = ({ error, data }) => {
  if (error) return <ErrorView message={error} />

  return (
    <Container maxWidth="lg">
      <ConvoList convos={data ?? []} />
    </Container>
  )
}

Page.auth = {
  required: true,
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req }) => {
  const url = apiUrl('/api/convos')
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }

  return await propsFromFetch(url, options)
}

export default Page
