import Layout from '@components/Layout'
import { Alert, AlertTitle, Box, CircularProgress, Typography } from '@mui/material'
import { useSession } from 'next-auth/react'
import { ReactNode } from 'react'

interface AuthedLayoutProps {
  children: ReactNode
}

export default function AuthedLayout({ children }: AuthedLayoutProps) {
  const { status } = useSession()

  if (status === 'unauthenticated')
    return (
      <Layout>
        <Box sx={{ my: 4 }}>
          <Alert variant="filled" severity="warning">
            <AlertTitle>Unauthenticated</AlertTitle>
            <Typography>Log in to view the quotes.</Typography>
          </Alert>
        </Box>
      </Layout>
    )

  if (status === 'loading')
    return (
      <Layout>
        <Box sx={{ my: 4, display: 'flex', justifyContent: 'center' }}>
          <CircularProgress />
        </Box>
      </Layout>
    )

  return <Layout>{children}</Layout>
}
