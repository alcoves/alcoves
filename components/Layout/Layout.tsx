import Footer from './Footer'
import SideBar from './SideBar'
import TopBar from './TopBar'

import { Box, Flex } from '@chakra-ui/react'

export default function Layout({ children, sidebar = true }) {
  return (
    <Box overflow="hidden">
      <TopBar />
      <Flex h="calc(100vh - 100px)" w="100%" overflowY="auto">
        {sidebar ? <SideBar /> : null}
        {children}
      </Flex>
      <Footer />
    </Box>
  )
}
