import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { SnackbarProvider } from 'notistack'
import CssBaseline from '@mui/material/CssBaseline'
import Theme from '@components/Theme'
import DocumentHead from '@components/DocumentHead'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Theme>
        <CssBaseline>
          <SnackbarProvider maxSnack={3}>
            <DocumentHead />
            <Component {...pageProps} />
          </SnackbarProvider>
        </CssBaseline>
      </Theme>
    </SessionProvider>
  )
}
