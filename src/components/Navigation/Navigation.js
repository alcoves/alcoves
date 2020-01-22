import UserStore from '../../data/User';
import React, { useContext } from 'react';
import SearchBar from '../SearchBar/SearchBar';

import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';
import { Button, Icon, Menu, Sidebar } from 'semantic-ui-react';

export default observer(props => {
  const history = useHistory();
  const user = useContext(UserStore);

  const state = useObservable({
    visible: false,
  });

  const handleClick = e => {
    history.push(`/${e.currentTarget.id}`);
  };

  const styles = {
    menu: {
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#efefef',
      justifyContent: 'space-between',
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '50px',
      height: '50px',
    },
    menuItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      color: 'white',
      height: '50px',
      width: '50px',
    },
  };

  return (
    <div>
      <div style={styles.menu}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'flex-start',
            minWidth: '150px',
            flex: 1,
          }}>
          <div style={styles.logo}>
            <Icon
              name='bars'
              style={{ cursor: 'pointer' }}
              onClick={() => (state.visible = !state.visible)}
            />
          </div>
          <div style={styles.logo}>
            <img
              id=''
              style={{ cursor: 'pointer' }}
              height={35}
              src='https://bken.io/favicon.ico'
              onClick={handleClick}
            />
          </div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', width: '100%' }}>
          <SearchBar />
        </div>
        {user.isLoggedIn() ? (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              minWidth: '150px',
              paddingRight: '5px',
              flex: 1,
            }}>
            <div style={styles.menuItem}>
              <Button circular id='upload' icon='upload' onClick={handleClick} />
            </div>
            <div style={styles.menuItem}>
              <Button circular id={`users/${user.id}`} icon='video' onClick={handleClick} />
            </div>
            <div style={styles.menuItem}>
              <Button
                circular
                id='account'
                onClick={handleClick}
                icon='user'
                onClick={handleClick}
              />
            </div>
          </div>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              minWidth: '150px',
              paddingRight: '5px',
              flex: 1,
              border: 'solid red 1px',
            }}>
            <div style={styles.menuItem}>
              <Button circular id='login' icon='user' onClick={handleClick} />
            </div>
          </div>
        )}
      </div>
      <Sidebar.Pushable style={{ height: 'calc(100vh - 50px)' }}>
        <Sidebar
          vertical
          as={Menu}
          icon='labeled'
          animation='overlay'
          onHide={() => (state.visible = false)}
          visible={state.visible}>
          <Menu.Item as='a' style={{ width: '200px' }}>
            <Icon name='home' />
            Home
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='gamepad' />
            Games
          </Menu.Item>
          <Menu.Item as='a'>
            <Icon name='camera' />
            Channels
          </Menu.Item>
        </Sidebar>
        <Sidebar.Pusher>
          <div>{props.children}</div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
});
