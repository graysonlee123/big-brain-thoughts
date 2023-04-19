import { Alert, AlertTitle, Container } from '@mui/material'

const ConvoListEmpty = () => {
  return (
    <Container maxWidth="sm">
      <Alert severity="info" variant="filled">
        <AlertTitle>Nothing found</AlertTitle>
        Sorry, no quotes were found.
      </Alert>
    </Container>
  )
}

export default ConvoListEmpty
