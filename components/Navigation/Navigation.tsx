import { MouseEvent, useState } from 'react'
import { useRouter } from 'next/router'
import { signIn, signOut, useSession } from 'next-auth/react'
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
  Typography,
} from '@mui/material'
import { FormatQuote as QuoteIcon } from '@mui/icons-material'
import Avatar from '@components/Avatar'

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
          <Box sx={{ mr: 1 }}>
            <QuoteIcon sx={{ display: 'block' }} />
          </Box>
          <Typography
            variant="h6"
            component="a"
            href="/"
            sx={{
              flexGrow: 1,
              color: 'inherit',
              fontWeight: 700,
              textDecoration: 'none',
            }}
            noWrap
          >
            Big Brain Thoughts
          </Typography>
          {status !== 'authenticated' ? (
            <Button onClick={() => signIn('discord')}>Login</Button>
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
                <MenuItem onClick={() => signOut()}>Sign out</MenuItem>
              </Menu>
            </>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  )
}
