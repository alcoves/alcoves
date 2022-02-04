import TopNav from './TopNav'
import SideNav from './SideNav'
import { Flex, Box } from '@chakra-ui/layout'

const Layout = (props: { children: React.ReactNode }) => (
  <Box>
    <TopNav />
    <Flex>
      <SideNav />
      <Flex w='100%' direction='column' overflowY='scroll'>
        <Flex h='calc(100vh - 50px)'>{props.children}</Flex>
      </Flex>
    </Flex>
  </Box>
)

export default Layout
