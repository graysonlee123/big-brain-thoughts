import { ReactNode } from 'react'
import Navigation from '@components/Navigation'
import { Box } from '@mui/material'

interface LayoutComponentProps {
  children: ReactNode
  spacing?: number
}

export function Layout({ children, spacing = 8 }: LayoutComponentProps) {
  return (
    <>
      <Navigation />
      <Box sx={{ my: spacing }}>{children}</Box>
    </>
  )
}
