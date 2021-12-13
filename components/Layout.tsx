import TopNav from './TopNav'
import Sidebar from './Sidebar'
import { Flex } from '@chakra-ui/layout'

const Layout = (props: { children: React.ReactNode }) => (
  <>
    <TopNav />
    <Flex minH='calc(100vh - 48px)'>
      <Sidebar />
      <Flex w='100%'>{props.children}</Flex>
    </Flex>
  </>
)

export default Layout
