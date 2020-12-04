import NavBar from './NavBar';

const layoutStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  width: '100%',
};

const contentStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
};

const Layout = ({ children }) => (
  <div className='Layout' style={layoutStyle}>
    <NavBar />
    <div className='Content' style={contentStyle}>
      {children}
    </div>
  </div>
);

export default Layout;