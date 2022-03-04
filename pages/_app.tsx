import '../styles/index.css'

import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React from 'react'

import { UserContext } from '../contexts/user'
import useUser from '../hooks/useUser'
import theme from '../styles/theme'

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
