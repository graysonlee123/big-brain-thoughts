import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import sessionlessRedirectProps from '@lib/sessionlessRedirectProps'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import apiUrl from '@lib/api/apiUrl'
import ConvoList from '@components/ConvoList'
import ErrorView from '@components/ErrorView'

type Page = NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> & PageWithAuthOptions
type PageProps = PropsFromFetchResult<UserWithConvos>

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

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { req } = context
  const redirect = await sessionlessRedirectProps(context)
  const id = context.query.id as string

  if (redirect !== null) {
    return redirect
  }

  const url = apiUrl(`/api/convos/user/${id}`)
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }

  return await propsFromFetch(url, options)
}

export default UserPage
