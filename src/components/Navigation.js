import React from 'react';
import withMe from '../lib/withMe';
import favicon from '../../public/favicon.ico';

import { Link } from 'react-router-dom';
import { IconButton } from '@material-ui/core';

import UploadIcon from '@material-ui/icons/PublishOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import VideoLibraryIcon from '@material-ui/icons/VideoLibraryOutlined';

import userAtom from '../lib/withUser';
import { useRecoilValue, useSetRecoilState } from 'recoil';

export default function Navigation() {
  const user = useRecoilValue(userAtom);
  const setUser = useSetRecoilState(userAtom);
  console.log('User Here!', user, setUser);

  const styles = {
    menu: {
      height: '50px',
      display: 'flex',
      alignItems: 'center',
      backgroundColor: '#23272a',
      justifyContent: 'space-between',
    },
    logo: {
      width: '50px',
      height: 'auto',
      display: 'flex',
      objectFit: 'cover',
      alignItems: 'center',
      justifyContent: 'center',
    },
  };

  return (
    <div>
      <div style={styles.menu}>
        <div
          style={{
            flex: 1,
            display: 'flex',
            minWidth: '150px',
            justifyContent: 'flex-start',
          }}>
          <Link to='/'>
            <img src={favicon} style={{ ...styles.logo, cursor: 'pointer' }} />
          </Link>
        </div>
        <div
          style={{
            flex: 1,
            display: 'flex',
            minWidth: '150px',
            paddingRight: '5px',
            justifyContent: 'flex-end',
          }}>
          <div>
            {user ? (
              <IconButton component={Link} to='/upload' color='secondary'>
                <UploadIcon />
              </IconButton>
            ) : (
              <div />
            )}
          </div>
          <div>
            {user && user.sub ? (
              <IconButton component={Link} to={`/users/${user.sub}`} color='secondary'>
                <VideoLibraryIcon />
              </IconButton>
            ) : (
              <div />
            )}
          </div>
          <div>
            {user ? (
              <IconButton to='/account' component={Link} color='secondary'>
                <PersonOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton to='/login' component={Link} color='secondary'>
                <PersonOutlinedIcon />
              </IconButton>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
