import Footer from './Footer'
import TopBar from './TopBar'
import SideBar from './SideBar'

import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { useUser } from '../../contexts/UserContext'
import Login from '../Login/Login'

// The outermost layout component
export default function Layout({ sidebar = true }: { sidebar?: boolean }) {
  const { user, isAuthenticated } = useUser()

  if (isAuthenticated) {
    return (
      <Box overflow="hidden">
        <TopBar />
        <Flex h="calc(100vh - 100px)" w="100%" overflowY="auto">
          {sidebar ? <SideBar /> : null}
          <Box w="100%" p="2">
            <Outlet />
          </Box>
        </Flex>
        <Footer />
      </Box>
    )
  } else if (!user && !isAuthenticated) {
    return <Login />
  }

  return 'Loading'
}
