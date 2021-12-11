import '../styles/index.css'

import React from 'react'
import Head from 'next/head'
import theme from '../styles/theme'
import useUser from '../hooks/useUser'
import { AppProps } from 'next/app'
import { UserContext } from '../contexts/user'
import { ChakraProvider } from '@chakra-ui/react'

function App(props: AppProps) {
  const userState = useUser()
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
        <UserContext.Provider value={userState}>
          <Component {...pageProps} />
        </UserContext.Provider>
      </ChakraProvider>
    </>
  )
}

export default App
