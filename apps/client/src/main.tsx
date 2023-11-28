import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/Home.tsx'
import Jobs from './components/Jobs/Jobs.tsx'
import Settings from './components/Settings.tsx'
import Login from './components/Login/Login.tsx'
import Layout from './components/Layout/Layout.tsx'
import Asset from './components/Assets/Asset.tsx'
import Assets from './components/Assets/Assets.tsx'

import { SWRConfig } from 'swr'
import { API_URL, fetcher } from './lib/api.ts'
import { theme } from './config/theme.tsx'
import { SSEProvider } from './contexts/SSE.tsx'
import { UserProvider } from './contexts/UserContext.tsx'
import { ChakraProvider, ColorModeScript } from '@chakra-ui/react'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.config.initialColorMode} />
    <ChakraProvider theme={theme}>
      <SSEProvider url={`${API_URL}/api/jobs/sse`}>
        <UserProvider>
          <SWRConfig value={{ fetcher: fetcher }}>
            <BrowserRouter>
              <Routes>
                <Route path="/" element={<Layout />}>
                  <Route path="/" element={<Home />} />
                  <Route path="/jobs" element={<Jobs />} />
                  <Route path="/assets" element={<Assets />} />
                  <Route path="/assets/:assetId" element={<Asset />} />
                  <Route path="/settings" element={<Settings />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Route>
                <Route path="/login" element={<Login />} />
              </Routes>
            </BrowserRouter>
          </SWRConfig>
        </UserProvider>
      </SSEProvider>
    </ChakraProvider>
  </React.StrictMode>
)
