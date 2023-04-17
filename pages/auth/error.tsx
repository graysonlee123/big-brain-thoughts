import { NextPage } from 'next'
import NextLink from 'next/link'
import { Button, Container } from '@mui/material'
import NextAuthErrorAlert from '@components/NextAuthErrorAlert'

const ErrorPage: NextPage = () => {
  return (
    <Container maxWidth="md">
      <NextAuthErrorAlert
        action={
          <Button href="/" color="inherit" size="small" LinkComponent={NextLink}>
            Home
          </Button>
        }
      />
    </Container>
  )
}

export default ErrorPage
