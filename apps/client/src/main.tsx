import React from 'react'
import ReactDOM from 'react-dom/client'
import Home from './components/Pages/Home.tsx'
import DevelopmentCSS from './components/DevelopmentCSS.tsx'

import { ChakraProvider, theme } from '@chakra-ui/react'
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
      <DevelopmentCSS />
      <RouterProvider router={router} />
    </ChakraProvider>
  </React.StrictMode>
)
