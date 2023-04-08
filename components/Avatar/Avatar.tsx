import { useSession } from 'next-auth/react'
import { Avatar as MuiAvatar } from '@mui/material'

export function Avatar() {
  const { data } = useSession()

  return <MuiAvatar src={data?.user?.image ?? undefined} />
}
