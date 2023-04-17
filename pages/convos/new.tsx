import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Container } from '@mui/material'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import apiUrl from '@lib/api/apiUrl'
import AddConvoForm from '@components/AddConvoForm'
import ErrorView from '@components/ErrorView'

type NewConvoPage = NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> &
  PageWithAuthOptions
type PageProps = PropsFromFetchResult<ApiUser[]>

const NewConvoPage: NewConvoPage = ({ error, data }) => {
  if (error) return <ErrorView message={error} />

  return (
    <Container maxWidth="sm">
      <AddConvoForm users={data ?? []} />
    </Container>
  )
}

NewConvoPage.auth = {
  required: true,
}

export const getServerSideProps: GetServerSideProps<PageProps> = async ({ req }) => {
  const url = apiUrl('/api/users')
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }

  return await propsFromFetch(url, options)
}

export default NewConvoPage
