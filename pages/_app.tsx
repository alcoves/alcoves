import '../styles/index.css'

import React from 'react'
import Head from 'next/head'
import theme from '../styles/theme'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { SessionProvider } from 'next-auth/react'

function App(props: AppProps) {
  const { Component, pageProps } = props

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        />
      </Head>
      <ChakraProvider theme={theme}>
        <SessionProvider session={pageProps.session}>
          <Component {...pageProps} />
        </SessionProvider>
      </ChakraProvider>
    </>
  )
}

export default App
