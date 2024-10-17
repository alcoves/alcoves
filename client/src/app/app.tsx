import '@fontsource/inter'
import * as React from 'react'
import * as ReactDOM from 'react-dom/client'

import { theme } from '../config/theme.tsx'
import { router } from './routes.tsx'
import { ChakraProvider } from '@chakra-ui/react'
import { RouterProvider } from 'react-router-dom'
import { ColorModeScript } from '@chakra-ui/react'
import { AuthProvider } from '../context/authProvider.tsx'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ColorModeScript initialColorMode={theme.initialColorMode} />
    <ChakraProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </QueryClientProvider>
    </ChakraProvider>
  </React.StrictMode>
)
