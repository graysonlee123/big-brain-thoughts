import { Link, LinkProps } from '@mui/material'

interface UserLinkProps extends Omit<LinkProps, 'href'> {
  userId: string
}

export default function UserLink({ userId, ...props }: UserLinkProps) {
  return (
    <Link href={`/user/${userId}`} {...props}>
      {props.children}
    </Link>
  )
}

UserLink.muiName = 'Link'
