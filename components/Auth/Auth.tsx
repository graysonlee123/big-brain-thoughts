import { ReactNode } from 'react'
import { useSession } from 'next-auth/react'
import FullscreenSpinner from '@components/FullscreenSpinner'

interface AuthComponentProps {
  children: ReactNode
}

const Auth = ({ children }: AuthComponentProps) => {
  const { status } = useSession({ required: true })

  if (status === 'loading') {
    return <FullscreenSpinner />
  }

  return <>{children}</>
}

export default Auth
