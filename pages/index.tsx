import type { NextPage } from 'next'
import { useSession } from 'next-auth/react'
import { Alert, AlertTitle, Box, CircularProgress, Typography } from '@mui/material'
import AuthButton from '@components/AuthButton'
import QuotesList from '@components/QuotesList'
import AddQuote from '@components/AddQuote'
import SelectUser from '@components/SelectUser'
import Layout from '@components/Layout'

const Home: NextPage = () => {
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

  return (
    <Layout>
      <AddQuote />
      <QuotesList />
      <SelectUser />
    </Layout>
  )
}

export default Home
