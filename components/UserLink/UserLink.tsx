import { Link } from '@mui/material'

interface UserLinkProps {
  user: DatabaseUser
}

export default function UserLink({ user }: UserLinkProps) {
  return <Link href={`/user/${user._id}`}>{user.name ?? 'Unknown'}</Link>
}
