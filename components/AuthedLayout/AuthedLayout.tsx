import { ReactNode } from 'react'
import { signIn, useSession } from 'next-auth/react'
import { Box, CircularProgress } from '@mui/material'
import Layout from '@components/Layout'

interface AuthedLayoutProps {
  children: ReactNode
}

export default function AuthedLayout({ children }: AuthedLayoutProps) {
  const { status } = useSession()

  if (status === 'unauthenticated') {
    /** Need to do nothing here if the page is being generated on the server. */
    if (typeof window === 'undefined') return null

    signIn('discord')
    return null
  }

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
