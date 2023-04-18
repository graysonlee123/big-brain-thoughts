import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import NextLink from 'next/link'
import { useRouter } from 'next/router'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Typography,
} from '@mui/material'
import propsFromFetch, { PropsFromFetchResult } from '@lib/propsFromFetch'
import apiUrl from '@lib/api/apiUrl'
import useFetchApiCallback from '@hooks/useFetchApiCallback'
import ErrorView from '@components/ErrorView'
import FullscreenSpinner from '@components/FullscreenSpinner'
import { useEffect, useState } from 'react'

interface InitiationPageProps extends PropsFromFetchResult<boolean> {}

const InitiationPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  error,
  data,
}) => {
  const {
    error: apiError,
    loading: apiLoading,
    res: apiRes,
    fetcher,
  } = useFetchApiCallback('/api/users/initiation', { method: 'PATCH' })
  const router = useRouter()
  const [redirect, setRedirect] = useState(false)

  const buttonText = apiError ? 'Retry' : 'Begin'

  /** Trigger a redirect if data returns `false`, meaning no legacy user is found. */
  useEffect(() => {
    if (data === false) setRedirect(true)
  }, [data])

  /** Redirect to the convos page. */
  useEffect(() => {
    if (redirect) router.push('/convos')
  }, [redirect, router])

  /** If there is an error, show the user. */
  if (error) {
    console.log({ error })
    return <ErrorView message={error} />
  }

  /** Show a spinner if there is no legacy user. */
  if (data === false) return <FullscreenSpinner />

  /** Data must be `true`, meaning there is a legacy user. */
  return (
    <>
      {apiLoading && <FullscreenSpinner />}
      <Container maxWidth="xs">
        {apiError && (
          <Box sx={{ mb: 4 }}>
            <Alert variant="filled" severity="error">
              <AlertTitle>Migration Error</AlertTitle>
              There was an issue migrating your account. You can retry or continue without
              migrating.
            </Alert>
          </Box>
        )}
        {apiRes?.data === true ? (
          <>
            <Alert
              variant="filled"
              severity="success"
              action={
                <Button href="/convos" LinkComponent={NextLink} color="inherit" size="small">
                  Start
                </Button>
              }
            >
              <AlertTitle>Success!</AlertTitle>
              Your account was migrated succesfully!
            </Alert>
          </>
        ) : (
          <>
            <Card>
              <CardContent>
                <Typography variant="h5" gutterBottom>
                  Migrate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  It looks like you have a legacy account from the old version of Big Brain
                  Thoughts. Push the &quot;{buttonText}&quot; to migrate your old data into your new
                  account.
                </Typography>
              </CardContent>
              <CardActions>
                <Button onClick={() => fetcher()} disabled={apiLoading}>
                  {buttonText}
                </Button>
              </CardActions>
            </Card>
          </>
        )}
      </Container>
    </>
  )
}

export const getServerSideProps: GetServerSideProps<InitiationPageProps> = async ({ req }) => {
  const url = apiUrl('/api/users/initiation/has-legacy')
  const options = { headers: { Cookie: req.headers.cookie ?? '' } }
  return await propsFromFetch(url, options)
}

export default InitiationPage
