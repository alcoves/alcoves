import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/Home.tsx'
import Jobs from './components/Jobs/Jobs.tsx'
import Settings from './components/Settings.tsx'
import Login from './components/Login/Login.tsx'
import Layout from './components/Layout/Layout.tsx'
import Images from './components/Images/Images.tsx'
import Videos from './components/Videos/Videos.tsx'
import VideoById from './components/Videos/VideoById.tsx'

import { SWRConfig } from 'swr'
import { fetcher } from './lib/api.ts'
import { theme } from './config/theme.tsx'
import { UserProvider } from './contexts/UserContext.tsx'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import Image from './components/Images/Image.tsx'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <UserProvider>
        <SWRConfig value={{ fetcher: fetcher }}>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Layout />}>
                <Route path="/" element={<Home />} />
                <Route path="/jobs" element={<Jobs />} />
                <Route path="/images" element={<Images />} />
                <Route path="/images/:imageId" element={<Image />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/videos" element={<Videos />} />
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
