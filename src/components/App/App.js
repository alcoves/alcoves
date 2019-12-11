import React, { useContext } from 'react';
import jwt from 'jsonwebtoken';

import Login from '../Login/Login';
import Home from '../Home/Home';
import Video from '../Video/Video';
import Navigation from '../Navigation/Navigation';

import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';
import { withCookies } from 'react-cookie';

import UserStore from '../../data/User';

export default observer(
  withCookies(props => {
    const { user } = useContext(UserStore);
    const accessToken = props.cookies.get('accessToken');

    if (accessToken) {
      // Rehydrate im memory user store with token information
      console.log('access token present, hydrating in memory store');
      const { payload } = jwt.decode(accessToken, { complete: true });
      user.id = payload.userId;
      user.email = payload.email;
    }

    return (
      <div>
        <Navigation {...props}>
          <Switch>
            <Route path='/login' render={routerProps => <Login {...routerProps} {...props} />} />
            <Route path='/videos/*' render={routerProps => <Video {...routerProps} {...props} />} />
            <Route path='/' render={routerProps => <Home {...routerProps} {...props} />} />
          </Switch>
        </Navigation>
      </div>
    );
  }),
);
