import React from 'react';

import Home from './components/Home';
import Dash from './components/Dash';
import Video from './components/Video';
import Login from './components/Auth/Login';
import Footer from './components/Footer';
import Confirm from './components/Auth/Confirm';
import Account from './components/Account';
import Register from './components/Register';
import Uploader from './components/Uploader';
import Editor from './components/Editor/Editor';
import Navigation from './components/Navigation';
import UserVideoGrid from './components/UserVideoGrid';
import ResetPassword from './components/Auth/ResetPassword';
import ResendActivationCode from './components/Auth/ResendActivationCode';

import { Switch, Route } from 'react-router-dom';
import { Typography } from '@material-ui/core';

function NoMatch() {
  return <Typography variant='h2'>404</Typography>;
}

function Content(props) {
  return <div style={{ minHeight: 'calc(100vh - 100px)' }}>{props.children}</div>;
}

function AppRouter() {
  return (
    <div>
      <Navigation />
      <Content>
        <Switch>
          <Route exact path='/' children={<Home />} />

          <Route exact path='/login' children={<Login />} />
          <Route exact path='/confirm' children={<Confirm />} />
          <Route exact path='/register' children={<Register />} />
          <Route exact path='/reset/password' children={<ResetPassword />} />
          <Route exact path='/reset/code' children={<ResendActivationCode />} />

          <Route exact path='/dash' children={<Dash />} />
          <Route exact path='/account' children={<Account />} />
          <Route exact path='/upload' children={<Uploader />} />
          <Route exact path='/videos/:id' children={<Video />} />
          <Route exact path='/editor/:id' children={<Editor />} />
          <Route exact path='/users/:username' children={<UserVideoGrid />} />
          <Route component={NoMatch} />
        </Switch>
      </Content>
      <Footer />
    </div>
  );
}

export default function App({ children }) {
  return <AppRouter>{children}</AppRouter>;
}
