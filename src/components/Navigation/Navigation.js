import React, { useContext } from 'react';
import UserStore from '../../data/User';

import { Button, Avatar, Drawer, Menu, Icon, Layout } from 'antd';
import { observer, useObservable } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';

const { Header, Content } = Layout;

export default observer(props => {
  const history = useHistory();
  const user = useContext(UserStore);

  const state = useObservable({
    visible: false,
  });

  const openDrawer = () => {
    state.visible = true;
  };

  const onClose = () => {
    state.visible = false;
  };

  const handleClick = () => {
    history.push('/upload');
  };

  const handleLoginRedirect = () => {
    history.push('/login');
  };

  const handleProfileRedirect = () => {
    history.push('/profile');
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout>
        <Drawer title='bken.io' placement='left' onClose={onClose} visible={state.visible}>
          <Menu mode='inline' defaultSelectedKeys={['1']}>
            <Menu.Item key='1'>
              <Icon type='home' />
              <span>Home</span>
            </Menu.Item>
            <Menu.Item key='2'>
              <Icon type='upload' />
              <span>Upload</span>
            </Menu.Item>
            <Menu.Item key='3'>
              <Icon type='video-camera' />
              <span>Videos</span>
            </Menu.Item>
            <Menu.Item key='4'>
              <Icon type='user' />
              <span>Account</span>
            </Menu.Item>
          </Menu>
        </Drawer>
        <Layout>
          <Header
            theme='dark'
            style={{
              display: 'flex',
              height: '64px',
              flexDirection: 'row',
              justifyContent: 'space-between',
              background: '#001529',
              padding: 0,
            }}>
            <Icon
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                fontSize: '22px',
                color: 'white',
                height: '64px',
                width: '64px',
              }}
              type='menu'
              onClick={openDrawer}
            />
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
              }}>
              {user.isLoggedIn() ? (
                <div
                  style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    fontSize: '22px',
                    color: 'white',
                    height: '64px',
                    width: '46px',
                  }}>
                  <Button onClick={handleClick} shape='circle' icon='upload' />
                </div>
              ) : null}
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontSize: '22px',
                  color: 'white',
                  height: '64px',
                  width: '46px',
                }}>
                {user.isLoggedIn() ? (
                  <Avatar
                    style={{
                      color: '#f56a00',
                      backgroundColor: '#fde3cf',
                      cursor: 'pointer',
                    }}
                    onClick={handleProfileRedirect}>
                    B
                  </Avatar>
                ) : (
                  <Button onClick={handleLoginRedirect} shape='circle' icon='user' />
                )}
              </div>
            </div>
          </Header>
          <Content
            style={{
              background: '#1f2430',
              height: 'auto',
              minHeight: 'auto',
            }}>
            {props.children}
          </Content>
        </Layout>
      </Layout>
    </Layout>
  );
});
