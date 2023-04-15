import type { NextPage } from 'next'
import { Button, Container } from '@mui/material'

const Page: NextPage = () => {
  return (
    <Container maxWidth="lg">
      <Button href="/convos">Go to Quotes</Button>
    </Container>
  )
}

export default Page
