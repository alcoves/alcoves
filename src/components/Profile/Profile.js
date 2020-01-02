import User from '../../data/User';
import React, { useContext } from 'react';
import { observer } from 'mobx-react-lite';

export default observer(() => {
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
          <h1>Hey there, {user.userName}</h1>
          <div style={styles.profileFooter}>
            <button
              type='primary'
              onClick={() => {
                user.logout(true);
              }}>
              Logout
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <div>You aren't logged in!</div>;
  }
});
