import '../config/global.css'
import theme from '../config/theme'
import DevelopmentCSS from '../components/DevelopmentCSS'

import { ChakraProvider } from '@chakra-ui/react'
import { UserProvider } from '../contexts/UserContext'

function App({ Component, pageProps }) {
  return (
    <UserProvider>
      <ChakraProvider theme={theme}>
        <DevelopmentCSS />
        <Component {...pageProps} />
      </ChakraProvider>
    </UserProvider>
  )
}

export default App
