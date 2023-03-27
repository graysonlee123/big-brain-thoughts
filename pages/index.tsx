import type { NextPage } from 'next'
import AuthButton from '@components/AuthButton'
import QuotesList from '@components/QuotesList'
import AddQuote from '@components/AddQuote'

const Home: NextPage = () => {
  return (
    <div>
      <AuthButton />
      <AddQuote />
      <QuotesList />
    </div>
  )
}

export default Home
