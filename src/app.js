import React from 'react';

import Home from './components/Home';
import Dash from './components/Dash';
import Login from './components/Login';
import Video from './components/Video';
import Footer from './components/Footer';
import Account from './components/Account';
import Confirm from './components/Confirm';
import Register from './components/Register';
import Uploader from './components/Uploader';
import Editor from './components/Editor/Editor';
import Navigation from './components/Navigation';
import UserVideoGrid from './components/UserVideoGrid';
import ResetPassword from './components/ResetPassword';
import ResendActivationCode from './components/ResendActivationCode';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { Typography } from '@material-ui/core';

function NoMatch() {
  return <Typography variant='h2'>404</Typography>;
}

function Content(props) {
  return <div style={{ minHeight: 'calc(100vh - 100px)' }}>{props.children}</div>;
}

function AppRouter() {
  return (
    <Router>
      <Navigation />
      <Content>
        <Switch>
          <Route exact path='/' children={<Home />} />
          <Route exact path='/dash' children={<Dash />} />
          <Route exact path='/login' children={<Login />} />
          <Route exact path='/confirm' children={<Confirm />} />
          <Route exact path='/account' children={<Account />} />
          <Route exact path='/upload' children={<Uploader />} />
          <Route exact path='/videos/:id' children={<Video />} />
          <Route exact path='/register' children={<Register />} />
          <Route exact path='/editor/:id' children={<Editor />} />
          <Route exact path='/reset/password' children={<ResetPassword />} />
          <Route exact path='/users/:username' children={<UserVideoGrid />} />
          <Route exact path='/reset/code' children={<ResendActivationCode />} />
          <Route component={NoMatch} />
        </Switch>
      </Content>
      <Footer />
    </Router>
  );
}

export default function App({ children }) {
  return <AppRouter>{children}</AppRouter>;
}
