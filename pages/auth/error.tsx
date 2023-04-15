import { NextPage } from 'next'
import { Container } from '@mui/material'
import NextAuthErrorAlert from '@components/NextAuthErrorAlert'

const ErrorPage: NextPage = () => {
  return (
    <Container maxWidth="md">
      <NextAuthErrorAlert />
    </Container>
  )
}

export default ErrorPage
