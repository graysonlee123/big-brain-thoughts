import { MouseEvent, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import Avatar from '@components/Avatar'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
} from '@mui/material'
import { useRouter } from 'next/router'

export function Navigation() {
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null)
  const { status } = useSession()
  const router = useRouter()

  function handleOpenUserMenu(e: MouseEvent<HTMLElement>) {
    setAnchorElUser(e.currentTarget)
  }

  function handleCloseUserMenu() {
    setAnchorElUser(null)
  }

  return (
    <AppBar position="static">
      <Container maxWidth="md">
        <Toolbar disableGutters>
          <Stack direction="row">
            <Button onClick={() => router.push('/')}>Home</Button>
            {status !== 'authenticated' && <Button onClick={() => signIn('discord')}>Login</Button>}
          </Stack>
          <Box sx={{ flexGrow: 1 }}></Box>
          {status === 'authenticated' && (
            <>
              <Tooltip title="Account details">
                <IconButton onClick={handleOpenUserMenu} sx={{ padding: 0 }}>
                  <Avatar />
                </IconButton>
              </Tooltip>
              <Menu
                anchorEl={anchorElUser}
                open={!!anchorElUser}
                onClose={handleCloseUserMenu}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                sx={{ mt: '3rem' }}
              >
                <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
