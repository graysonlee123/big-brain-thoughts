import type { NextPage } from 'next'
import ConvoList from '@components/ConvoList'
import AddQuote from '@components/AddQuote'
import SelectUser from '@components/SelectUser'
import AuthedLayout from '@components/AuthedLayout/AuthedLayout'

const Home: NextPage = () => {
  return (
    <AuthedLayout>
      <AddQuote />
      <ConvoList />
      <SelectUser />
    </AuthedLayout>
  )
}

export default Home
