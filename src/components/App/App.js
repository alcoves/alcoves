import React from 'react';

import Login from '../Login/Login';
import TopBar from '../TopBar/TopBar';
import Content from '../Content/Content';
import Notification from '../Notification/Notification';

import jwt from 'jsonwebtoken';

import { Route, Switch } from 'react-router-dom';
import { observer } from 'mobx-react';
import { withCookies } from 'react-cookie';

export default observer(
  withCookies(props => {
    const accessToken = props.cookies.get('accessToken');

    if (accessToken) {
      const { payload } = jwt.decode(accessToken, { complete: true });
      console.log('accessToken present', payload);
    }

    return (
      <div>
        <TopBar {...props} />
        <Notification {...props} />
        <Switch>
          <Route path='/login' render={routerProps => <Login {...routerProps} {...props} />} />
          <Route path='/' render={routerProps => <Content {...routerProps} {...props} />} />
        </Switch>
      </div>
    );
  }),
);
