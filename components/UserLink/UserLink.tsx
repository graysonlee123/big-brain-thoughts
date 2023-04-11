import { Link } from '@mui/material'
import { User } from 'next-auth'

interface UserLinkProps {
  user: User
}

export default function UserLink({ user }: UserLinkProps) {
  return <Link href={`/user/${user._id}`}>{user.name ?? 'Unknown'}</Link>
}
