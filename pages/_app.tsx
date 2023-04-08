import { SessionProvider } from 'next-auth/react'
import { AppProps } from 'next/app'

import CssBaseline from '@mui/material/CssBaseline'

import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'
import Theme from '@components/Theme'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  return (
    <SessionProvider session={session}>
      <Theme>
        <CssBaseline>
          <Component {...pageProps} />
        </CssBaseline>
      </Theme>
    </SessionProvider>
  )
}
