import React, { useContext } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import BkenIcon from '../../../public/favicon.ico';

import { useHistory } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import UserStore from '../../data/User';

const useStyles = makeStyles(theme => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
}));

export default observer(() => {
  const { user } = useContext(UserStore);
  const classes = useStyles();
  const history = useHistory();

  return (
    <div className={classes.root}>
      <AppBar position='static'>
        <Toolbar>
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
            <div> {user.email} </div>
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
