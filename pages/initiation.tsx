import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { User } from 'next-auth'
import {
  Alert,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  Container,
  Typography,
} from '@mui/material'
import sessionlessRedirectProps from '@lib/sessionlessRedirectProps'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import apiUrl from '@lib/api/apiUrl'
import useFetchApiCallback from '../hooks/useFetchApiCallback'
import ErrorView from '@components/ErrorView'
import AuthedLayout from '@components/AuthedLayout'

interface InitiationPageProps extends PropsFromFetchResult<User | null> {}

const InitiationPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  error,
  data,
}) => {
  const { error: apiError, loading, res, fetcher } = useFetchApiCallback<null>('/api/initiation')
  if (apiError) console.warn({ apiError })

  /** The error from getServerSideProps. */
  if (error) return <ErrorView message={error} />

  /** The data from getServerSideProps. */
  /** If data is null, no legacy user was found. */
  if (data === null)
    return (
      <AuthedLayout>
        <Container maxWidth="md" sx={{ my: 8 }}>
          <Alert
            severity="warning"
            action={
              <Button href="/" color="inherit" size="small">
                Home
              </Button>
            }
          >
            <Typography>There was no legacy user found for this account.</Typography>
          </Alert>
        </Container>
      </AuthedLayout>
    )

  /** The API will return data only if a legacy user is found. */
  if (data) {
    if (apiError) return <ErrorView message="There was an error initiating your user." />

    if (loading)
      return (
        <AuthedLayout>
          <Box sx={{ my: 8, display: 'flex', justifyContent: 'center' }}>
            <CircularProgress />
          </Box>
        </AuthedLayout>
      )

    return (
      <AuthedLayout>
        <Container maxWidth="md" sx={{ my: 8 }}>
          {res?.ok === true ? (
            <Alert
              action={
                <Button href="/" color="inherit" size="small">
                  Start
                </Button>
              }
            >
              <Typography>Succesfully migrated your account!</Typography>
            </Alert>
          ) : (
            <>
              <Card sx={{ maxWidth: '20rem', mx: 'auto' }}>
                <CardContent>
                  <Typography variant="h5" gutterBottom>
                    Migrate
                  </Typography>
                  <Typography color="text.secondary">
                    Since this is your first time signing in, click the button below in order to
                    migrate your old data.
                  </Typography>
                </CardContent>
                <CardActions>
                  <Button onClick={() => fetcher()}>Begin</Button>
                </CardActions>
              </Card>
            </>
          )}
        </Container>
      </AuthedLayout>
    )
  }

  return null
}

export const getServerSideProps: GetServerSideProps<InitiationPageProps> = async (context) => {
  const { req } = context
  const redirect = await sessionlessRedirectProps(context)

  if (redirect !== null) {
    return redirect
  }

  const url = apiUrl('/api/users/has-legacy')
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }
  return await propsFromFetch(url, options)
}

export default InitiationPage
