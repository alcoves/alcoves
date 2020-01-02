import React, { useContext } from 'react';
import UserStore from '../../data/User';

import { Button, Avatar } from 'antd';
import { observer } from 'mobx-react-lite';
import { useHistory } from 'react-router-dom';

export default observer(props => {
  const history = useHistory();
  const user = useContext(UserStore);

  const handleClick = e => {
    history.push(`/${e.currentTarget.id}`);
  };

  const styles = {
    menu: {
      height: '50px',
      backgroundColor: '#171b24',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    menuContainer: {
      display: 'flex',
    },
    logo: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      width: '100px',
      height: '50px',
      cursor: 'pointer',
    },
    menuItem: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      fontSize: '22px',
      color: 'white',
      height: '50px',
      width: '50px',
    },
  };

  return (
    <div>
      <div style={styles.menu}>
        <div style={styles.menuContainer}>
          <div styles={styles.logo}>
            <img height={35} src='https://bken.io/favicon.ico' />
          </div>
        </div>
        {user.isLoggedIn() ? (
          <div style={styles.menuContainer}>
            <div style={styles.menuItem}>
              <Button id='upload' onClick={handleClick} shape='circle' icon='upload' />
            </div>
            <div style={styles.menuItem}>
              <Button id='' onClick={handleClick} shape='circle' icon='video-camera' />
            </div>
            <div style={styles.menuItem}>
              <Avatar
                id='profile'
                style={{
                  color: '#f56a00',
                  backgroundColor: '#fde3cf',
                  cursor: 'pointer',
                }}
                onClick={handleClick}>
                {user.userName ? user.userName.charAt(0).toUpperCase() : null}
              </Avatar>
            </div>
          </div>
        ) : (
          <div style={styles.menuContainer}>
            <div style={styles.menuItem}>
              <Button id='login' onClick={handleClick} shape='circle' icon='user' />
            </div>
          </div>
        )}
      </div>
      <div>{props.children}</div>
    </div>
  );
});
