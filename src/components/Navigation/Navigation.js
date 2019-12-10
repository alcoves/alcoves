import './Navigation.css';
import React from 'react';

import { Menu, Icon, Button, Layout } from 'antd';
import { observer, useObservable } from 'mobx-react-lite';

const { Header, Sider, Content } = Layout;
const { SubMenu } = Menu;

const SidebarMenu = observer(() => {
  const state = useObservable({
    collapsed: false,
  });

  const toggleCollapsed = () => {
    state.collapsed = !state.collapsed;
  };

  return (
    <div style={{ width: 'auto', minHeight: '100%' }}>
      <Button
        type="primary"
        onClick={toggleCollapsed}
        style={{ marginBottom: 16 }}>
        <Icon type={state.collapsed ? 'menu-unfold' : 'menu-fold'} />
      </Button>
      <Menu
        defaultSelectedKeys={['1']}
        defaultOpenKeys={['sub1']}
        mode="inline"
        theme="dark"
        inlineCollapsed={state.collapsed}>
        <Menu.Item key="1">
          <Icon type="pie-chart" />
          <span>Option 1</span>
        </Menu.Item>
        <Menu.Item key="2">
          <Icon type="desktop" />
          <span>Option 2</span>
        </Menu.Item>
        <Menu.Item key="3">
          <Icon type="inbox" />
          <span>Option 3</span>
        </Menu.Item>
        <SubMenu
          key="sub1"
          title={
            <span>
              <Icon type="mail" />
              <span>Navigation One</span>
            </span>
          }>
          <Menu.Item key="5">Option 5</Menu.Item>
          <Menu.Item key="6">Option 6</Menu.Item>
          <Menu.Item key="7">Option 7</Menu.Item>
          <Menu.Item key="8">Option 8</Menu.Item>
        </SubMenu>
        <SubMenu
          key="sub2"
          title={
            <span>
              <Icon type="appstore" />
              <span>Navigation Two</span>
            </span>
          }>
          <Menu.Item key="9">Option 9</Menu.Item>
          <Menu.Item key="10">Option 10</Menu.Item>
          <SubMenu key="sub3" title="Submenu">
            <Menu.Item key="11">Option 11</Menu.Item>
            <Menu.Item key="12">Option 12</Menu.Item>
          </SubMenu>
        </SubMenu>
      </Menu>
    </div>
  );
});

export default observer(() => {
  const state = useObservable({
    collapsed: false,
  });

  const toggle = () => {
    state.collapsed = !state.collapsed;
  };

  return (
    <div style={{ height: '100vh', width: '100vw' }}>
      <div style={{ height: '50px', width: '100%' }}> top bar </div>
      <Layout>
        <Sider trigger={null} collapsible collapsed={state.collapsed}>
          <div className="logo" />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="user" />
              <span>nav 1</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="video-camera" />
              <span>nav 2</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="upload" />
              <span>nav 3</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header style={{ background: '#fff', padding: 0 }}>
            <Icon
              className="trigger"
              type={state.collapsed ? 'menu-unfold' : 'menu-fold'}
              onClick={toggle}
            />
          </Header>
          <Content
            style={{
              margin: '24px 16px',
              padding: 24,
              background: '#fff',
              minHeight: 280,
            }}>
            Content
          </Content>
        </Layout>
      </Layout>
    </div>
  );
});

// return (
//   <div
//     style={{
//       display: 'flex',
//       flexDirection: 'column',
//       height: '100vh',
//       width: '100vw',
//     }}>
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'row',
//         height: '50px',
//         width: '100%',
//         border: 'solid red 1px',
//       }}>
//       <div> this is the flyout button </div>
//       <div> this is the user avatar </div>
//     </div>
//     <div
//       style={{
//         display: 'flex',
//         flexDirection: 'row',
//         border: 'solid yellow 1px',
//         flexGrow: 1,
//       }}>
//       <div>
//         <SidebarMenu />
//       </div>
//       <div style={{ background: 'green' }}>this is the actual content</div>
//     </div>
//   </div>
// );
