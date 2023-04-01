import type { NextPage } from 'next'
import AuthButton from '@components/AuthButton'
import QuotesList from '@components/QuotesList'
import AddQuote from '@components/AddQuote'
import SelectUser from '@components/SelectUser'

const Home: NextPage = () => {
  return (
    <div>
      <AuthButton />
      <AddQuote />
      <QuotesList />
      <SelectUser />
    </div>
  )
}

export default Home
