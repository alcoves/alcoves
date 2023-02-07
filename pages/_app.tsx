import '../config/global.css'
import theme from '../config/theme'
import { ChakraProvider } from '@chakra-ui/react'

function App({ Component, pageProps }) {
  const isDev = process.env.NODE_ENV === 'development'
  return (
    <ChakraProvider theme={theme}>
      {isDev && (
        <style global jsx>{`
          * {
            outline: 1px solid red;
          }

          *:hover {
            outline: 2px solid blue;
          }
        `}</style>
      )}
      <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default App
