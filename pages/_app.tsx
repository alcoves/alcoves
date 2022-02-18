import '../styles/index.css'

import React from 'react'
import theme from '../styles/theme'
import useUser from '../hooks/useUser'
import useUploads from '../hooks/useUploads'
import { AppProps } from 'next/app'
import { UserContext } from '../contexts/user'
import { ChakraProvider } from '@chakra-ui/react'
import { UploadsContext } from '../contexts/uploads'
import Head from 'next/head'

function App(props: AppProps) {
  const userState = useUser()
  const uploadsState = useUploads()
  const { Component, pageProps } = props

  if (!userState) return null

  return (
    <>
      <Head>
        <meta name='viewport' content='width=device-width,initial-scale=1.0' />
      </Head>
      <ChakraProvider theme={theme}>
        <UserContext.Provider value={userState}>
          <UploadsContext.Provider value={uploadsState}>
            <Component {...pageProps} />
          </UploadsContext.Provider>
        </UserContext.Provider>
      </ChakraProvider>
    </>
  )
}

export default App
