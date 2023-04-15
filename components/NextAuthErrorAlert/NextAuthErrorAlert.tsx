import { Alert, AlertTitle, Box, Button } from '@mui/material'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

function errorMessage(error = '') {
  switch (error) {
    case 'OAuthCallback':
      return 'Something went wrong trying to sign you in.'
    case 'OAuthCreateAccount':
      return 'Something went wrong making your account.'
    case 'OAuthAccountNotLinked':
      return 'Your account is linked to a different Discord login.'
    case 'Configuration':
      return "There is something wrong with the server's configuration."
    case 'AccessDenied':
      return "You don't have access to Big Brain Thoughts."
    default:
      return 'Sorry, There was an error signing you in.'
  }
}

interface NextAuthErrorsProps {
  action?: ReactNode
}

const NextAuthErrorAlert = ({ action }: NextAuthErrorsProps) => {
  const router = useRouter()
  const error = router.query.error as string | undefined

  if (error === undefined) return null

  return (
    <Box sx={{ mb: 8 }}>
      <Alert
        variant="filled"
        severity="error"
        action={
          action ?? (
            <Button href="/auth/signin" color="inherit" size="small">
              Retry
            </Button>
          )
        }
      >
        <AlertTitle>Login Error</AlertTitle>
        {errorMessage(error)}
      </Alert>
    </Box>
  )
}

export default NextAuthErrorAlert
