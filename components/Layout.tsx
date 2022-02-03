import TopNav from './TopNav'
import SideNav from './SideNav'
import { Flex, Box } from '@chakra-ui/layout'

const Layout = (props: { children: React.ReactNode }) => (
  <Box overflow='scroll' h='100vh' w='100vw'>
    <TopNav />
    <Flex>
      <SideNav />
      <Flex bg='gray.100' w='100%' direction='column' overflow='scroll'>
        <Flex h='100%'>{props.children}</Flex>
      </Flex>
    </Flex>
  </Box>
)

export default Layout
