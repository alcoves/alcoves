import React, { useContext } from 'react';
import UserStore from '../../data/User';

import { Button } from 'semantic-ui-react';
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
      width: '70px',
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
        <div style={styles.menuContainer}>
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
        {user.isLoggedIn() ? (
          <div style={styles.menuContainer}>
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
          <div style={styles.menuContainer}>
            <div style={styles.menuItem}>
              <Button circular id='login' icon='user' onClick={handleClick} />
            </div>
          </div>
        )}
      </div>
      <div>{props.children}</div>
    </div>
  );
});
