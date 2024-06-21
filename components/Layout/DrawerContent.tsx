import NextLink from 'next/link'
import { useSession } from 'next-auth/react'
import Divider from '@mui/material/Divider'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemButton from '@mui/material/ListItemButton'
import ListItemIcon from '@mui/material/ListItemIcon'
import ListItemText from '@mui/material/ListItemText'
import Toolbar from '@mui/material/Toolbar'
import Typography from '@mui/material/Typography'
import ListIcon from '@mui/icons-material/List'
import AddIcon from '@mui/icons-material/Add'
import PersonIcon from '@mui/icons-material/Person'
import DrawerUser from './DrawerUser'

const links = [
  {
    label: 'All Quotes',
    href: '/convos',
    icon: <ListIcon />,
  },
  {
    label: 'Add Quote',
    href: '/convos/new',
    icon: <AddIcon />,
  },
]

const DrawerContent = () => {
  const { data } = useSession()

  if (!data) return null

  return (
    <>
      <div>
        <Toolbar sx={{ width: '100%', backgroundColor: 'primary.dark' }}>
          <Typography
            variant="h6"
            href="/convos"
            component={NextLink}
            color="inherit"
            sx={{ textDecoration: 'none' }}
            noWrap
          >
            Big Brain Thoughts
          </Typography>
        </Toolbar>
        <Divider />
        <List>
          {links.map((link) => (
            <ListItem key={link.href} disablePadding>
              <ListItemButton href={link.href}>
                <ListItemIcon>{link.icon}</ListItemIcon>
                <ListItemText primary={link.label} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <ListItem disablePadding>
          <ListItemButton href={`/user/${data.user.id}`}>
            <ListItemIcon>
              <PersonIcon />
            </ListItemIcon>
            <ListItemText primary="My quotes" />
          </ListItemButton>
        </ListItem>
      </div>
      <DrawerUser />
    </>
  )
}

export default DrawerContent
