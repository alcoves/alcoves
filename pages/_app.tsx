import '../styles/index.css'

import { ChakraProvider } from '@chakra-ui/react'
import { AppProps } from 'next/app'
import Head from 'next/head'
import React, { useEffect } from 'react'
import { RecoilRoot } from 'recoil'

import { userStore } from '../stores/user'
import theme from '../styles/theme'

export default function App(props: AppProps) {
  const user = userStore()
  const { Component, pageProps } = props

  useEffect(() => {
    user.login()
  }, [])

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        />
      </Head>
      <RecoilRoot>
        <ChakraProvider theme={theme}>
          <Component {...pageProps} />
        </ChakraProvider>
      </RecoilRoot>
    </>
  )
}
