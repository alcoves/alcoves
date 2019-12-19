import React, { useContext } from 'react';

import Home from '../Home/Home';
import Video from '../Video/Video';
import Login from '../Login/Login';
import Upload from '../Upload/Upload';
import Profile from '../Profile/Profile';
import Navigation from '../Navigation/Navigation';

import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';

import UserStore from '../../data/User';

export default observer(props => {
  const userStore = useContext(UserStore);
  const accessToken = localStorage.getItem('accessToken');
  userStore.login(accessToken);

  return (
    <div>
      <Navigation {...props}>
        <Switch>
          <Route path='/login' render={routerProps => <Login {...routerProps} {...props} />} />
          <Route path='/profile' render={routerProps => <Profile {...routerProps} {...props} />} />
          <Route path='/videos/*' render={routerProps => <Video {...routerProps} {...props} />} />
          <Route path='/upload' render={routerProps => <Upload {...routerProps} {...props} />} />
          <Route path='/' render={routerProps => <Home {...routerProps} {...props} />} />
        </Switch>
      </Navigation>
    </div>
  );
});
