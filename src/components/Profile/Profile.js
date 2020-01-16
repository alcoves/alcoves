import User from '../../data/User';
import api from '../../api/api';
import React, { useContext } from 'react';

import { observer, useObservable } from 'mobx-react-lite';
import { Button, Icon } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
  },
  card: {
    minWidth: '250px',
    width: '100%',
    maxWidth: '400px',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
    backgroundColor: '#272d3c',
    color: 'white',
    overflow: 'hidden',
    WebkitBoxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
    MozBoxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
    boxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
  },
  avatarCircleContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: '#1F2430',
    margin: '10px',
  },
  displayName: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '1em',
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: '2.6em',
    lineHeight: '1.3em',
    fontWeight: '700',
  },
  profileFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
};

export default observer(() => {
  const history = useHistory();
  const user = useContext(User);

  const state = useObservable({
    user: {},
    loading: true,
    uploadLoading: false,
  });

  const loadUser = async () => {
    try {
      state.user = {};
      const res = await api({
        method: 'get',
        url: `/me`,
      });

      state.user = res.data.payload;
      state.loading = false;
    } catch (error) {
      console.error();
    }
  };

  const onChangeHandler = async event => {
    try {
      state.uploadLoading = true;
      const data = new FormData();
      data.append('avatar', event.target.files[0]);
      await api({
        data,
        method: 'post',
        url: `/users/${user.id}/avatars`,
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      await loadUser();
    } catch (error) {
      console.error(error);
    } finally {
      state.uploadLoading = false;
    }
  };

  const fileInputRef = React.createRef();

  if (state.loading) {
    loadUser();
  } else if (user.isLoggedIn()) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.avatarCircleContainer}>
            {state.user.avatar ? (
              <img
                alt='profile'
                src={`${state.user.avatar}?${Date.now()}`}
                style={styles.avatarCircle}
              />
            ) : (
              <div style={styles.avatarCircle} />
            )}
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                circular
                basic
                loading={state.uploadLoading}
                color='teal'
                size='tiny'
                onClick={() => fileInputRef.current.click()}>
                <Icon name='camera' />
              </Button>
              <input
                ref={fileInputRef}
                type='file'
                name='avatar'
                accept='image/jpeg'
                hidden
                onChange={onChangeHandler}
              />
            </div>
          </div>
          <div style={styles.displayName}>{user.displayName}</div>
          <div style={styles.profileFooter}>
            <Button
              basic
              fluid
              color='teal'
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
