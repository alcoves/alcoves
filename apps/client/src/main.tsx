import React, { Suspense } from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/Pages/Home.tsx'
import VideoById from './components/Videos/Video.tsx'
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
  {
    path: '/videos/:id',
    element: <VideoById />,
  },
])

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ChakraProvider theme={theme}>
      <ColorModeScript initialColorMode={theme.config.initialColorMode} />
      <SWRConfig value={{ fetcher: fetcher }}>
        <DevelopmentCSS />
        <RouterProvider
          router={router}
          fallbackElement={<div>Global Error</div>}
        />
      </SWRConfig>
    </ChakraProvider>
  </React.StrictMode>
)
