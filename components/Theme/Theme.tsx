import { ReactNode } from 'react'
import { ThemeProvider } from '@mui/system'
import { createTheme } from '@mui/material/styles'

interface ThemeComponentProps {
  children: ReactNode
}

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
})

export function Theme({ children }: ThemeComponentProps) {
  return <ThemeProvider theme={theme}>{children}</ThemeProvider>
}
