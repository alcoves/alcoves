import React from 'react';
import Grid from '@material-ui/core/Grid';
import favicon from '../../public/favicon.ico';
import IconButton from '@material-ui/core/IconButton';
import UploadIcon from '@material-ui/icons/PublishOutlined';
import PersonOutlinedIcon from '@material-ui/icons/PersonOutlined';
import VideoLibraryIcon from '@material-ui/icons/VideoLibraryOutlined';

import { Link } from 'react-router-dom';
import { Box } from '@material-ui/core';
import { useAuth0 } from '@auth0/auth0-react';

export default function Navigation() {
  const { isLoading, isAuthenticated, error, user, loginWithRedirect } = useAuth0();

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
    <Grid style={styles.menu} container>
      <Grid item>
        <Link to='/'>
          <img src={favicon} style={{ ...styles.logo, cursor: 'pointer' }} />
        </Link>
      </Grid>
      <Grid item>
        <Grid container>
          <Box>
            {user && (
              <IconButton component={Link} to='/upload' color='primary'>
                <UploadIcon />
              </IconButton>
            )}
          </Box>
          <Box>
            {user && user.sub && (
              <IconButton
                component={Link}
                to={`/users/${user.nickname.toLowerCase()}`}
                color='primary'>
                <VideoLibraryIcon />
              </IconButton>
            )}
          </Box>
          <Box>
            {user ? (
              <IconButton to='/account' component={Link} color='primary'>
                <PersonOutlinedIcon />
              </IconButton>
            ) : (
              <IconButton onClick={loginWithRedirect} color='primary'>
                <PersonOutlinedIcon />
              </IconButton>
            )}
          </Box>
        </Grid>
      </Grid>
    </Grid>
  );
}
