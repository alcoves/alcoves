import React, { useContext } from 'react';
import UserStore from '../../data/User';

import { Button, Avatar, Drawer, Icon, Layout } from 'antd';
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

  const handleMenuClick = e => {
    onClose();
    history.push(`/${e.currentTarget.id}`);
  };

  const handleLoginRedirect = () => {
    history.push('/login');
  };

  const handleProfileRedirect = () => {
    history.push('/profile');
  };

  const row = {
    cursor: 'pointer',
    height: '40px',
  };

  return (
    <Layout style={{ height: '100vh' }}>
      <Layout>
        <Drawer title='bken.io' placement='left' onClose={onClose} visible={state.visible}>
          <div id='' style={row} onClick={handleMenuClick}>
            <Icon type='home' />
            <span>Home</span>
          </div>
          <div id='upload' style={row} onClick={handleMenuClick}>
            <Icon type='upload' />
            <span>Upload</span>
          </div>
          <div id='videos' style={row} onClick={handleMenuClick}>
            <Icon type='video-camera' />
            <span>Videos</span>
          </div>
          <div id='profile' style={row} onClick={handleMenuClick}>
            <Icon type='user' />
            <span>Acount</span>
          </div>
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
