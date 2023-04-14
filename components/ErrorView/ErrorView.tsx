import Layout from '@components/Layout'
import { Alert, Button, Container, Link, Typography } from '@mui/material'

interface ErrorViewProps {
  message?: string
}

const ErrorView = ({ message }: ErrorViewProps) => {
  const text = message ?? 'Sorry, there was an issue getting the data for this page.'

  return (
    <Layout>
      <Container maxWidth="md" sx={{ my: 8 }}>
        <Alert
          severity="error"
          action={
            <Button href="/" color="inherit" size="small">
              Home
            </Button>
          }
        >
          <Typography>{text}</Typography>
        </Alert>
      </Container>
    </Layout>
  )
}

export default ErrorView
