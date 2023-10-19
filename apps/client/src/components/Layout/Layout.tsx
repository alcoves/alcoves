import Footer from './Footer'
import TopBar from './TopBar'
import SideBar from './SideBar'
import Login from '../Login/Login'

import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { useUser } from '../../contexts/UserContext'

// The outermost layout component
export default function Layout({ sidebar = true }: { sidebar?: boolean }) {
  const { user, isLoading } = useUser()

  if (user) {
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
  } else if (!user && !isLoading) {
    return <Login />
  }

  return 'Loading'
}
