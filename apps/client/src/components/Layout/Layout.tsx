import Login from '../Login/Login'
import SideBar from '../SideBar/SideBar'

import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'
import { SSEProvider } from '../../contexts/SSE'
import { useUser } from '../../contexts/UserContext'
import { ConfigProvider } from '../../contexts/ConfigContext'

export default function Layout() {
  const { user, isLoading } = useUser()

  if (user) {
    return (
      <ConfigProvider>
        <SSEProvider url={`/api/jobs/sse`}>
          <Box overflow="hidden">
            <Flex h="100vh" w="100%">
              <SideBar />
              <Box w="100%" p="2" overflowY="auto">
                <Outlet />
              </Box>
            </Flex>
          </Box>
        </SSEProvider>
      </ConfigProvider>
    )
  } else if (!user && !isLoading) {
    return <Login />
  }

  return 'Loading'
}
