import { useMemo } from 'react'
import { Avatar, AvatarProps } from '@mui/material'

interface UserAvatarProps extends Omit<AvatarProps, 'src'> {
  user: ApiUser
}

const UserAvatar = ({ user, ...props }: UserAvatarProps) => {
  const fallbackImage = useMemo(() => {
    const modulo = user.username.length % 5 || 5
    return `/images/avatars/placeholder-${modulo}.png`
  }, [user.username])

  return <Avatar src={user.avatar ?? fallbackImage} alt={user.username} {...props} />
}

export default UserAvatar
