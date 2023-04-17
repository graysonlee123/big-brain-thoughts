import type { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import NextLink from 'next/link'
import { Box, Button, Container } from '@mui/material'
import sessionlessRedirectProps from '@lib/sessionlessRedirectProps'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import apiUrl from '@lib/api/apiUrl'
import ErrorView from '@components/ErrorView'
import ConvoList from '@components/ConvoList'

type Page = NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> & PageWithAuthOptions
type PageProps = PropsFromFetchResult<Conversation[]>

const Page: Page = ({ error, data }) => {
  if (error) return <ErrorView message={error} />

  return (
    <Container maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 8 }}>
        <Button href="/convos/new" LinkComponent={NextLink} variant="contained">
          Add Quote
        </Button>
      </Box>
      <ConvoList convos={data ?? []} />
    </Container>
  )
}

Page.auth = {
  required: true,
}

export const getServerSideProps: GetServerSideProps<PageProps> = async (context) => {
  const { req } = context
  const redirect = await sessionlessRedirectProps(context)

  if (redirect !== null) {
    return redirect
  }

  const url = apiUrl('/api/convos')
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }

  return await propsFromFetch(url, options)
}

export default Page
