import { Box, Typography } from '@mui/material'
import UserAvatar from '@components/UserAvatar'

interface UserHeaderProps {
  user: ApiUser
}

const UserHeader = ({ user }: UserHeaderProps) => {
  return (
    <Box sx={{ mb: 10, textAlign: 'center' }}>
      <Box sx={{ display: 'flex', justifyContent: 'center', mb: 2 }}>
        <UserAvatar user={user} />
      </Box>
      <Typography variant="subtitle1" color="text.secondary">
        Showing quotes from
      </Typography>
      <Typography variant="h4"> {user.username}</Typography>
    </Box>
  )
}

export default UserHeader
