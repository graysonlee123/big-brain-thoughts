import { useSession, signIn, signOut } from 'next-auth/react'

export default function AuthButton() {
  const { data: session } = useSession()

  if (!session)
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn('discord')}>Sign in</button>
      </>
    )

  return null
}
