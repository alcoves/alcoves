import '../styles/index.css'
import React, { useEffect } from 'react'
import Head from 'next/head'
import { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/router'
import * as gtag from '../utils/gtag'
import { Chakra } from '../styles/chakra'
// import { UploadContext } from '../context/UploadContext'
// import UploadReducer from '../reducers/UploadReducer'

function App(props: AppProps): JSX.Element {
  const { Component, pageProps } = props
  const router = useRouter()
  // const [uploads, dispatch] = useReducer(UploadReducer, [])

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
      {/* <UploadContext.Provider value={{ uploads, dispatch }}> */}
      <SessionProvider session={pageProps.session}>
        <Chakra cookies={pageProps.cookies}>
          <Component {...pageProps} />
        </Chakra>
      </SessionProvider>
      {/* </UploadContext.Provider> */}
    </>
  )
}

export default App
