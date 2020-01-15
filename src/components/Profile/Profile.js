import User from '../../data/User';
import React, { useContext } from 'react';

import { observer } from 'mobx-react-lite';
import { Button } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

export default observer(() => {
  const history = useHistory();
  const user = useContext(User);

  const styles = {
    container: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'row',
      justifyContent: 'center',
    },
    profile: {
      display: 'flex',
      alignItems: 'center',
      flexDirection: 'column',
      justifyContent: 'center',
    },
    profileFooter: {
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
  };

  if (user.isLoggedIn()) {
    return (
      <div style={styles.container}>
        <div style={styles.profile}>
          <h1>Hey there, {user.displayName}</h1>
          <div style={styles.profileFooter}>
            <Button
              type='primary'
              onClick={() => {
                user.logout(true);
              }}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  } else {
    history.push('/login');
  }
});
