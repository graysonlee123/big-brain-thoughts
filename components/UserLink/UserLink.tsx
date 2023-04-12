import { Link, LinkProps } from '@mui/material'
import { User } from 'next-auth'

interface UserLinkProps extends Omit<LinkProps, 'href'> {
  user: User
}

export default function UserLink({ user, ...props }: UserLinkProps) {
  return (
    <Link {...props} href={`/user/${user._id}`}>
      {user.name ?? 'Unknown'}
    </Link>
  )
}

UserLink.muiName = 'Link'
