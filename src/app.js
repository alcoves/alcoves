import React from 'react';

import Home from './components/Home';
import Login from './components/Login';
import Video from './components/Video';
import Account from './components/Account';
import Confirm from './components/Confirm';
import Register from './components/Register';
import Uploader from './components/Uploader';
import Editor from './components/Editor/Editor';
import Navigation from './components/Navigation';
import UserVideoGrid from './components/UserVideoGrid';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function NoMatch() {
  return <h2>404</h2>;
}

function AppRouter() {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route exact path='/' children={<Home />} />
        <Route exact path='/login' children={<Login />} />
        <Route exact path='/confirm' children={<Confirm />} />
        <Route exact path='/account' children={<Account />} />
        <Route exact path='/upload' children={<Uploader />} />
        <Route exact path='/videos/:id' children={<Video />} />
        <Route exact path='/register' children={<Register />} />
        <Route exact path='/users/:id' children={<UserVideoGrid />} />
        <Route exact path='/editor/:id' children={<Editor />} />
        <Route component={NoMatch} />
      </Switch>
    </Router>
  );
}

export default function App({ children }) {
  return <AppRouter>{children}</AppRouter>;
}
