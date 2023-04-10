import { ReactNode } from 'react'
import Navigation from '@components/Navigation'

interface LayoutComponentProps {
  children: ReactNode
}

export function Layout({ children }: LayoutComponentProps) {
  return (
    <>
      <Navigation />
      {children}
    </>
  )
}
