import '../config/global.css'
import theme from '../config/theme'
import DevelopmentCSS from '../components/DevelopmentCSS'

import { useState } from 'react'
import { ChakraProvider } from '@chakra-ui/react'
import { UserProvider } from '../contexts/UserContext'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'

function App({ Component, pageProps }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <Hydrate state={pageProps.dehydratedState}>
        <UserProvider>
          <ChakraProvider theme={theme}>
            <DevelopmentCSS />
            <Component {...pageProps} />
          </ChakraProvider>
        </UserProvider>
      </Hydrate>
    </QueryClientProvider>
  )
}

export default App
