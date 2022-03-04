import '../styles/index.css'

import Head from 'next/head'
import React from 'react'
import theme from '../styles/theme'
import useUser from '../hooks/useUser'
import { AppProps } from 'next/app'
import { ChakraProvider } from '@chakra-ui/react'
import { UserContext } from '../contexts/user'

function App(props: AppProps) {
  const userState = useUser()
  const { Component, pageProps } = props
  if (!userState) return null

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
