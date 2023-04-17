import { MouseEvent, useState } from 'react'
import NextLink from 'next/link'
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
          <Typography
            variant="h6"
            component={NextLink}
            href={status === 'authenticated' ? '/convos' : '/'}
            sx={{
              mr: 'auto',
              color: 'inherit',
              fontWeight: 700,
              textDecoration: 'none',
            }}
            noWrap
          >
            Big Brain Thoughts
          </Typography>
          <Button href="/convos" LinkComponent={NextLink} sx={{ mr: 1 }}>
            Quotes
          </Button>
          <Button href="/convos/new" LinkComponent={NextLink} sx={{ mr: 1 }}>
            Add
          </Button>
          {status !== 'authenticated' && (
            <Button href="/auth/signin" variant="contained" LinkComponent={NextLink} sx={{ ml: 1 }}>
              Login
            </Button>
          )}
          {status === 'authenticated' && (
            <Box sx={{ ml: 2 }}>
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
                {status === 'authenticated' ? (
                  <MenuItem onClick={() => signOut({ callbackUrl: '/' })}>Logout</MenuItem>
                ) : (
                  <MenuItem onClick={() => signIn('discord', { callbackUrl: '/convos' })}>
                    Login
                  </MenuItem>
                )}
              </Menu>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
