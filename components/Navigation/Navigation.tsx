import { MouseEvent, useState } from 'react'
import { signIn, signOut, useSession } from 'next-auth/react'
import {
  AppBar,
  Box,
  Button,
  Container,
  IconButton,
  Menu,
  MenuItem,
  Toolbar,
  Tooltip,
  Typography,
} from '@mui/material'
import Avatar from '@components/Avatar'

export function Navigation() {
  const [anchorElUser, setAnchorElUser] = useState<HTMLElement | null>(null)
  const { status } = useSession()

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
          <Box sx={{ flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="a"
              href="/"
              sx={{
                color: 'inherit',
                fontWeight: 700,
                textDecoration: 'none',
              }}
              noWrap
            >
              Big Brain Thoughts
            </Typography>
          </Box>
          {status !== 'authenticated' ? (
            <Button onClick={() => signIn('discord', { callbackUrl: '/convos' })}>Login</Button>
          ) : (
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
                keepMounted
              >
                <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>Sign out</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
