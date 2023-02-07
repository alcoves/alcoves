import Footer from './Footer'
import TopBar from './TopBar'
import SideBar from './SideBar'

import { Box, Flex } from '@chakra-ui/react'

export default function Layout({ children }) {
  return (
    <Box>
      <TopBar />
      <Flex h='100%'>
        <SideBar />
        <Box w='100%' p='2' overflowY='scroll'>
          {children}
        </Box>
      </Flex>
      <Footer />
    </Box>
  )
}
