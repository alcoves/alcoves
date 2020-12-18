import NavBar from './NavBar';
import Footer from './Footer';

function Content({ children }) {
  return <div style={{ minHeight: 'calc(100vh - 100px)' }}>{children}</div>;
}

const Layout = ({ children }) => (
  <>
    <NavBar />
    <Content>
      {children}
    </Content>
    <Footer />
  </>
);

export default Layout;