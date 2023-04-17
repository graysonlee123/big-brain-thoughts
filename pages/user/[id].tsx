import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import apiUrl from '@lib/api/apiUrl'
import ConvoList from '@components/ConvoList'
import ErrorView from '@components/ErrorView'

type Page = NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> & PageWithAuthOptions
type PageProps = PropsFromFetchResult<{ convos: ApiConvo[]; user: ApiUser }>

const UserPage: Page = ({ error, data }) => {
  if (error) return <ErrorView message={error} />

  return (
    <Container maxWidth="lg" sx={{ my: 8 }}>
      <ConvoList convos={data?.convos ?? []} user={data?.user} />
    </Container>
  )
}

UserPage.auth = {
  required: true,
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req, query }) => {
  const url = apiUrl(`/api/convos/user/${query.id}`)
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }

  return await propsFromFetch(url, options)
}

export default UserPage
