import '@fontsource/fira-sans'

import ReactDOM from 'react-dom/client'

import { App } from './App'
import { theme } from './theme'
import { BrowserRouter as Router } from 'react-router-dom'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'

const root = ReactDOM.createRoot(document.getElementById('app') as Element | DocumentFragment)
root.render(
  <>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ChakraProvider>
  </>
)
