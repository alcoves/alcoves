import React from 'react';

import { Typography, } from '@material-ui/core';
import { Switch, Route, } from 'react-router-dom';
import Home from './components/Home';
import Video from './components/Video';
import Login from './components/Login';
import Footer from './components/Footer';
import Account from './components/Account';
import Confirm from './components/Confirm';
import Register from './components/Register';
import Uploader from './components/Uploader';
import Editor from './components/Editor/Editor';
import Navigation from './components/Navigation';
import SearchResults from './components/SearchResults';
import UserVideoGrid from './components/UserVideoGrid';

function NoMatch() {
  return <Typography variant='h2'>404</Typography>;
}

function Content({ children }) {
  return <div style={{ minHeight: 'calc(100vh - 100px)' }}>{children}</div>;
}

function AppRouter() {
  return (
    <div>
      <Navigation />
      <Content>
        <Switch>
          <Route exact path='/'><Home /></Route>
          <Route exact path='/search'><SearchResults /></Route>
          <Route exact path='/login'><Login /></Route>
          <Route exact path='/register'><Register /></Route>
          <Route exact path='/v/:id'><Video /></Route>
          <Route exact path='/confirm'><Confirm /></Route>
          <Route exact path='/account'><Account /></Route>
          <Route exact path='/upload'><Uploader /></Route>
          <Route exact path='/editor/:id'><Editor /></Route>
          <Route exact path='/u/:username'><UserVideoGrid /></Route>
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
