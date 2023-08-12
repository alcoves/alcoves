import Layout from './components/Layout/Layout'
import DevelopmentCSS from './components/DevelopmentCSS'

import { ChakraProvider, theme } from '@chakra-ui/react'

export default function App() {
  return (
    <ChakraProvider theme={theme}>
      <DevelopmentCSS />
      <Layout>
        <h1>App</h1>
      </Layout>
    </ChakraProvider>
  )
}
