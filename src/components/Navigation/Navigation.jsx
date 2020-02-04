import React, { useContext } from 'react';

import { Link } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';
import { Button, Icon, Sidebar } from 'semantic-ui-react';
import SearchBar from '../SearchBar/SearchBar';
import UserStore from '../../data/User';

export default observer(props => {
  const user = useContext(UserStore);

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
          <Link to='/' style={styles.logo}>
            <img style={{ cursor: 'pointer' }} height={35} src='https://bken.io/favicon.ico' />
          </Link>
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
              <Button as={Link} to='/upload' circular size='medium' icon='upload' />
            </div>
            <div style={styles.menuItem}>
              <Button as={Link} to={`/users/${user.id}`} circular size='medium' icon='video' />
            </div>
            <div style={styles.menuItem}>
              <Button as={Link} to='/account' circular size='medium' icon='user' />
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
            }}>
            <div style={styles.menuItem}>
              <Button as={Link} to='/login' circular icon='user' />
            </div>
          </div>
        )}
      </div>
      <div>{props.children}</div>
    </div>
  );
});
