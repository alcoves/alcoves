import TopNav from './TopNav'
import Sidebar from './Sidebar'
import { Flex } from '@chakra-ui/layout'

const Layout = (props: { children: React.ReactNode }) => (
  <Flex w='100vw' h='100vh'>
    <Sidebar />
    <Flex w='100%' direction='column'>
      <TopNav />
      <Flex h='100%'>{props.children}</Flex>
    </Flex>
  </Flex>
)

export default Layout
