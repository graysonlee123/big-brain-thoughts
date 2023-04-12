import { GetServerSideProps, InferGetServerSidePropsType, NextPage } from 'next'
import { Session, getServerSession } from 'next-auth'
import authOptions from '@lib/authOptions'

interface InitiationPageProps {
  serverSession: Session
  test: 'test'
}

const InitiationPage: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = ({
  serverSession: session,
  test,
}) => {
  async function handleClick() {
    try {
      const res = await fetch('/api/initiation')
      const json = await res.json()

      console.log({ json })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <div>
      Session: {JSON.stringify(session, null, 2)} {test}
      <button onClick={handleClick}>Go</button>
    </div>
  )
}

export const getServerSideProps: GetServerSideProps<InitiationPageProps> = async ({ req, res }) => {
  const session = await getServerSession(req, res, authOptions)

  if (session === null) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    }
  }

  return {
    props: {
      serverSession: session,
      test: 'test',
    },
  }
}

export default InitiationPage
