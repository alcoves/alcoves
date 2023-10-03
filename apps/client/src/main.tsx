import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/Home.tsx'
import Layout from './components/Layout/Layout.tsx'
import VideoById from './components/Videos/VideoById.tsx'
import DevelopmentCSS from './components/DevelopmentCSS.tsx'

import { SWRConfig } from 'swr'
import { fetcher } from './lib/api.ts'
import { theme } from './config/theme.tsx'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <SWRConfig value={{ fetcher: fetcher }}>
        <DevelopmentCSS />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Layout />}>
              <Route path="/" element={<Home />} />
              <Route path="/videos/:id" element={<VideoById />} />
              <Route path="*" element={<Navigate to="/" />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SWRConfig>
    </ChakraProvider>
  </React.StrictMode>
)
