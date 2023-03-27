import type { NextPage } from 'next'
import AuthButton from '@components/AuthButton'
import QuotesList from '@components/QuotesList'

const Home: NextPage = () => {
  return (
    <div>
      <AuthButton />
      <QuotesList />
    </div>
  )
}

export default Home
