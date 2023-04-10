import { ReactNode } from 'react'
import Navigation from '@components/Navigation'
import { Container } from '@mui/material'

interface LayoutComponentProps {
  children: ReactNode
}

export function Layout({ children }: LayoutComponentProps) {
  return (
    <>
      <Navigation />
      <Container maxWidth="lg">{children}</Container>
    </>
  )
}
