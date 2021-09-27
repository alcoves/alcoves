import '../styles/index.css'
import React, { useEffect } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as gtag from '../utils/gtag'
import { Chakra } from '../styles/chakra'

function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props
  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      gtag.pageview(url)
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
  }, [router.events])

  return (
    <>
      <Head>
        <meta
          name='viewport'
          content='width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
        />
      </Head>
      <SessionProvider session={pageProps.session}>
        <Chakra cookies={pageProps.cookies}>
          <Component {...pageProps} />
        </Chakra>
      </SessionProvider>
    </>
  )
}

export default App
