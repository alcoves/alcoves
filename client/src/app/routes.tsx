import RootRoute from './routes/root'
import UploadRoute from './routes/upload'
import LandingRoute from './routes/landing'
import ProfileRoute from './routes/profile'
import ErrorPage from '../components/error'
import AuthLoginRoute from './routes/auth/login'

import { createBrowserRouter } from 'react-router-dom'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootRoute />,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '/',
        element: <LandingRoute />,
      },
      {
        path: '/upload',
        element: <UploadRoute />,
      },
      {
        path: '/profile',
        element: <ProfileRoute />,
      },
    ],
  },
  {
    path: '/auth/login',
    element: <AuthLoginRoute />,
    errorElement: <ErrorPage />,
  },
])
