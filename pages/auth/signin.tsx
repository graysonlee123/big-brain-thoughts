import { Fragment } from 'react'
import { GetServerSidePropsContext, InferGetServerSidePropsType } from 'next'
import { getProviders, signIn } from 'next-auth/react'
import { getServerSession } from 'next-auth'
import { Alert, Button, Container, Paper, Stack, Typography } from '@mui/material'
import authOptions from '@lib/authOptions'
import NextAuthErrorAlert from '@components/NextAuthErrorAlert'

const SigninPage = ({ providers }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const values = Object.values(providers ?? [])

  return (
    <Container maxWidth="lg">
      <NextAuthErrorAlert />
      {values.length === 0 ? (
        <Alert severity="error">No sign in methods were found.</Alert>
      ) : (
        <Paper sx={{ p: 4, maxWidth: '24rem', mx: 'auto' }}>
          <Typography variant="h4">Login</Typography>
          <Typography variant="body2" color="text.secondary">
            Login to use Big Brain Thoughts.
          </Typography>
          <Stack gap={2} sx={{ mt: 4 }}>
            {Object.values(values).map((provider) => (
              <Fragment key={provider.id}>
                <Button
                  onClick={() => signIn(provider.id, { callbackUrl: '/convos' })}
                  variant="contained"
                >
                  Sign in with {provider.name}
                </Button>
              </Fragment>
            ))}
          </Stack>
        </Paper>
      )}
    </Container>
  )
}

export const getServerSideProps = async (context: GetServerSidePropsContext) => {
  const session = await getServerSession(context.req, context.res, authOptions)

  if (session) {
    return { redirect: { destination: '/', permanent: false } }
  }

  return {
    props: { providers: (await getProviders()) ?? [] },
  }
}

export default SigninPage
