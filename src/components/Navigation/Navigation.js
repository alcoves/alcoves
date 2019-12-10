import React from 'react';

import { Menu, Icon, Layout } from 'antd';
import { observer, useObservable } from 'mobx-react-lite';

const { Header, Sider, Content } = Layout;

export default observer(props => {
  const state = useObservable({
    collapsed: true,
  });

  const toggle = () => {
    state.collapsed = !state.collapsed;
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout>
        <Sider trigger={null} collapsible collapsed={state.collapsed}>
          <Icon
            style={{
              display: 'flex',
              padding: '23px 0px 23px 0px',
              justifyContent: 'center',
              color: 'white',
            }}
            type={state.collapsed ? 'menu-unfold' : 'menu-fold'}
            onClick={toggle}
          />
          <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']}>
            <Menu.Item key="1">
              <Icon type="home" />
              <span>Home</span>
            </Menu.Item>
            <Menu.Item key="2">
              <Icon type="upload" />
              <span>Upload</span>
            </Menu.Item>
            <Menu.Item key="3">
              <Icon type="video-camera" />
              <span>Videos</span>
            </Menu.Item>
            <Menu.Item key="4">
              <Icon type="user" />
              <span>Account</span>
            </Menu.Item>
          </Menu>
        </Sider>
        <Layout>
          <Header
            theme="dark"
            style={{ background: '#001529', padding: 0 }}></Header>
          <Content
            style={{
              background: '#212c34',
            }}>
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
});
