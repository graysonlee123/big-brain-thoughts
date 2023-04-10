import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import { Alert, AlertTitle, Box, CircularProgress, Container, Typography } from '@mui/material'
import Layout from '@components/Layout'

interface AuthedLayoutProps {
  children: ReactNode
}

export default function AuthedLayout({ children }: AuthedLayoutProps) {
  const { status } = useSession()

  if (status === 'unauthenticated')
    return (
      <Layout>
        <Container maxWidth="sm" sx={{ my: 8 }}>
          <Alert variant="filled" severity="warning">
            <AlertTitle>Unauthenticated</AlertTitle>
            <Typography>Log in to view the quotes.</Typography>
          </Alert>
        </Container>
      </Layout>
    )

  if (status === 'loading')
    return (
      <Layout>
        <Box sx={{ my: 8, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Layout>
    )

  return <Layout>{children}</Layout>
}
