import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';
import { Button, Icon, Sidebar } from 'semantic-ui-react';
import SearchBar from '../SearchBar/SearchBar';
import UserStore from '../../data/User';

export default observer(props => {
  const user = useContext(UserStore);

  const state = useObservable({
    visible: false,
  });

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

  const handleItemClick = e => {
    console.log('name', e.target);
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
          }}
        >
          <div style={styles.logo}>
            <Icon
              name='bars'
              style={{ cursor: 'pointer' }}
              onClick={() => (state.visible = !state.visible)}
            />
          </div>
          <div as={Link} to='/' style={styles.logo}>
            <img style={{ cursor: 'pointer' }} height={35} src='https://bken.io/favicon.ico' />
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
            }}
          >
            <div style={styles.menuItem}>
              <Button as={Link} to='/upload' circular icon='upload' />
            </div>
            <div style={styles.menuItem}>
              <Button as={Link} to={`users/${user.id}`} circular icon='video' />
            </div>
            <div style={styles.menuItem}>
              <Button as={Link} to='/account' circular icon='user' />
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
            }}
          >
            <div style={styles.menuItem}>
              <Button as={Link} to='/login' circular icon='user' />
            </div>
          </div>
        )}
      </div>
      <Sidebar.Pushable style={{ height: 'calc(100vh - 50px)' }}>
        <Sidebar
          vertical
          icon='labeled'
          animation='overlay'
          style={{ background: 'white', width: '200px' }}
          onHide={() => (state.visible = false)}
          visible={state.visible}
        >
          <div>
            <div
              value={`/users/${user.id}`}
              style={{ margin: '10px 0px 10px 0px', cursor: 'pointer' }}
              onClick={handleItemClick}
            >
              Upload
            </div>
            <div
              value={`/users/${user.id}`}
              style={{ margin: '10px 0px 10px 0px', cursor: 'pointer' }}
              onClick={handleItemClick}
            >
              My Bken
            </div>
            <div
              value={`/users/${user.id}`}
              style={{ margin: '10px 0px 10px 0px', cursor: 'pointer' }}
              onClick={handleItemClick}
            >
              My Account
            </div>
          </div>
        </Sidebar>
        <Sidebar.Pusher>
          <div>{props.children}</div>
        </Sidebar.Pusher>
      </Sidebar.Pushable>
    </div>
  );
});
