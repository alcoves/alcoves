import NavBar from './NavBar';

const Layout = ({ children }) => (
  <>
    <NavBar />
    {children}
  </>
);

export default Layout;