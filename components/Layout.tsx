import NavBar from './NavBar'
import Sidebar from './Sidebar'
import { Flex } from '@chakra-ui/layout'

function Content(props: { children: React.ReactNode }) {
  return <Flex>{props.children}</Flex>
}

const Layout = (props: { children: React.ReactNode }) => (
  <>
    <NavBar />
    <Flex minH='calc(100vh - 48px)'>
      <Sidebar />
      <Content>{props.children}</Content>
    </Flex>
  </>
)

export default Layout
