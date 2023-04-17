import { NextPage } from 'next'
import { Container } from '@mui/material'
import AddConvoForm from '@components/AddConvoForm'

type NewConvoPage = NextPage & PageWithAuthOptions

const NewConvoPage: NewConvoPage = () => {
  return (
    <Container maxWidth="sm">
      <AddConvoForm />
    </Container>
  )
}

NewConvoPage.auth = {
  required: true,
}

export default NewConvoPage
