import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import BkenIcon from '../../../public/favicon.ico';
import Avatar from '@material-ui/core/Avatar';

import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';
import { deepOrange } from '@material-ui/core/colors';

import UserStore from '../../data/User';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  toolbar: {
    minHeight: '50px',
    maxHeight: '50px',
  },
  title: {
    flexGrow: 1,
  },
  defaultAvatar: {
    color: '#fff',
    backgroundColor: '#1f2430',
  },
}));

export default observer(() => {
  const { user } = useContext(UserStore);
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar className={classes.toolbar}>
          <IconButton edge='start' className={classes.menuButton} color='inherit' aria-label='menu'>
            <MenuIcon />
          </IconButton>
          <div
            className={classes.title}
            onClick={() => {
              history.push('/');
            }}>
            <img style={{ cursor: 'pointer' }} src={BkenIcon} width={30} height={30} />
          </div>
          {user.id ? (
            <Avatar className={classes.defaultAvatar}>{user.email[0].toUpperCase()}</Avatar>
          ) : (
            <Button
              onClick={() => {
                history.push('/login');
              }}
              color='inherit'>
              Login
            </Button>
          )}
        </Toolbar>
      </AppBar>
    </div>
  );
});
