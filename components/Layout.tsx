import NavBar from './NavBar'
import Footer from './Footer'
import { Box } from '@chakra-ui/layout'

function Content(props: { children: React.ReactNode }) {
  return <Box minH='calc(100vh - 96px)'>{props.children}</Box>
}

const Layout = (props: { children: React.ReactNode }): JSX.Element => (
  <>
    <NavBar />
    <Content>{props.children}</Content>
    <Footer />
  </>
)

export default Layout
