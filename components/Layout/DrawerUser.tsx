import LinkedAvatar from '@components/LinkedAvatar'
import SignoutIcon from '@mui/icons-material/Logout'
import { Box, Button, IconButton, Skeleton, Stack, Tooltip, Typography } from '@mui/material'
import { signIn, signOut, useSession } from 'next-auth/react'
import NextLink from 'next/link'
import { ReactNode } from 'react'

type WrapperProps = {
  children: ReactNode
}

const Wrapper = ({ children }: WrapperProps) => {
  return <Box sx={{ mt: 'auto', p: 2, backgroundColor: 'grey.800' }}>{children}</Box>
}

const DrawerUser = () => {
  const { data, status } = useSession()

  if (status === 'loading')
    return (
      <Wrapper>
        <Stack direction="row" alignItems="center" gap={2}>
          <Skeleton variant="circular" width={48} height={48} />
          <Skeleton variant="rounded" width={100} height={24} />
        </Stack>
      </Wrapper>
    )

  if (status === 'unauthenticated')
    return (
      <Wrapper>
        <Button
          variant="contained"
          onClick={() => signIn('discord', { callbackUrl: '/convos' })}
          LinkComponent={NextLink}
          fullWidth
        >
          Signin
        </Button>
      </Wrapper>
    )

  return (
    <Wrapper>
      <Stack direction="row" alignItems="center" gap={2}>
        <LinkedAvatar
          href={`/user/${data!.user.id}`}
          img={data!.user.avatar}
          discriminator={data!.user.username}
          alt={data!.user.username}
        />
        <Box>
          <Typography sx={{ fontWeight: 'bold' }} noWrap>
            {data!.user.username}
          </Typography>
          <Typography variant="caption" component="p" noWrap>
            Signed in
          </Typography>
        </Box>
        <Stack direction="row" alignItems="center" gap={1} sx={{ ml: 'auto' }}>
          <Tooltip title="Signout">
            <IconButton onClick={() => signOut({ callbackUrl: '/auth/signin' })}>
              <SignoutIcon />
            </IconButton>
          </Tooltip>
        </Stack>
      </Stack>
    </Wrapper>
  )
}

export default DrawerUser
