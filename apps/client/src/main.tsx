import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/Pages/Home.tsx'
import DevelopmentCSS from './components/DevelopmentCSS.tsx'

import { SWRConfig } from 'swr'
import { fetcher } from './lib/api.ts'
import { ChakraProvider, ColorModeScript, theme } from '@chakra-ui/react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'

const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <div>Not found</div>,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SWRConfig value={{ fetcher: fetcher }}>
        <DevelopmentCSS />
        <RouterProvider router={router} />
      </SWRConfig>
    </ChakraProvider>
  </React.StrictMode>
)
