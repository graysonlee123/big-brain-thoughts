import { NextPage } from 'next'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { SnackbarProvider } from 'notistack'
import CssBaseline from '@mui/material/CssBaseline'
import Theme from '@components/Theme'
import DocumentHead from '@components/DocumentHead'
import Auth from '@components/Auth'
import Layout from '@components/Layout'
import '@fontsource/roboto/300.css'
import '@fontsource/roboto/400.css'
import '@fontsource/roboto/500.css'
import '@fontsource/roboto/700.css'

export default function App({ Component, pageProps: { session, ...pageProps } }: AppProps) {
  const hasAuth = (component: any): component is NextPage & PageWithAuthOptions => {
    return Boolean(component.auth?.required)
  }

  return (
    <SessionProvider session={session}>
      <Theme>
        <CssBaseline>
          <SnackbarProvider maxSnack={3}>
            <DocumentHead />
            <Layout>
              {hasAuth(Component) === true ? (
                <Auth>
                  <Component {...pageProps} />
                </Auth>
              ) : (
                <Component {...pageProps} />
              )}
            </Layout>
          </SnackbarProvider>
        </CssBaseline>
      </Theme>
    </SessionProvider>
  )
}
