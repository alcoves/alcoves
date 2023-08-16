import Footer from './Footer'
import TopBar from './TopBar'
import SideBar from './SideBar'

import { Outlet } from 'react-router-dom'
import { Box, Flex } from '@chakra-ui/react'

export default function Layout({ sidebar = true }: { sidebar?: boolean }) {
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
}
