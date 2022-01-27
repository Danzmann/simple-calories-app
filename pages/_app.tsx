import Head from 'next/head'
import type { AppProps } from 'next/app'

import styled, { createGlobalStyle, ThemeProvider } from 'styled-components'

import theme from '../globals/global.styles'
import 'antd/dist/antd.css'

import { UserProvider } from '../context/UserContext'

const GlobalStyle = createGlobalStyle<{ theme: any }>(
  ({
     theme: {
       colors: { black },
     },
   }) => ({
    '*': {
      boxSizing: 'border-box',
    },
    'html, body': {
      margin: 0,
      padding: 0,
      fontFamily:
        '-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif',
    },
    a: {
      color: black,
      '@media (hover: hover) and (pointer: fine)': {
        ':hover': {
          color: 'dodgerblue',
        },
      },
    },
  }),
)

const App = styled.div({
  display: 'flex',
  flexDirection: 'column',
  minHeight: '100vh',
})

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <UserProvider>
      <ThemeProvider theme={theme}>
        <Head>
          <meta
            name="viewport"
            content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover"
          />

          <link rel="icon" href="/favicon.ico" />
        </Head>

        <GlobalStyle />

        <App>
          <Component {...pageProps} />
        </App>
      </ThemeProvider>
    </UserProvider>
  )
}

export default MyApp
