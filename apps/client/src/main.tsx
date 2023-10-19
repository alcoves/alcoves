import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/Home.tsx'
import Login from './components/Login/Login.tsx'
import Layout from './components/Layout/Layout.tsx'
import ImagesPage from './components/Images/Images.tsx'
import VideoById from './components/Videos/VideoById.tsx'
import DevelopmentCSS from './components/DevelopmentCSS.tsx'

import { SWRConfig } from 'swr'
import { fetcher } from './lib/api.ts'
import { theme } from './config/theme.tsx'
import { UserProvider } from './contexts/UserContext.tsx'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <UserProvider>
        <SWRConfig value={{ fetcher: fetcher }}>
          <DevelopmentCSS />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/images" element={<ImagesPage />} />
                <Route path="/videos" element={<ImagesPage />} />
                <Route path="/videos/:id" element={<VideoById />} />
                <Route path="*" element={<Navigate to="/" />} />
              </Route>
              <Route path="/login" element={<Login />} />
            </Routes>
          </BrowserRouter>
        </SWRConfig>
      </UserProvider>
    </ChakraProvider>
  </React.StrictMode>
)
