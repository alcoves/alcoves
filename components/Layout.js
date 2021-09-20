import NavBar from './NavBar'
import Footer from './Footer'
import { Box } from '@chakra-ui/layout'

function Content({ children }) {
  return <Box minH='calc(100vh - 96px)'>{children}</Box>
}

const Layout = ({ children }) => (
  <>
    <NavBar />
    <Content>{children}</Content>
    <Footer />
  </>
)

export default Layout
