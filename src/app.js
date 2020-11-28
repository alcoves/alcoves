import React from 'react';

import { Typography, } from '@material-ui/core';
import { Switch, Route, } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/index';
import Video from './pages/video';
import Footer from './components/footer';
import Account from './pages/account/index';
import Confirm from './pages/confirm';
import UserProfile from './pages/user/index';
import Register from './pages/register';
import Editor from './pages/editor/index';
import Navigation from './components/navigation';
import Upload from './pages/upload/index';
import EditVideo from './pages/editor/id/index';
import Search from './pages/search';

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
          <Route exact path='/search'><Search /></Route>
          <Route exact path='/login'><Login /></Route>
          <Route exact path='/register'><Register /></Route>
          <Route exact path='/v/:id'><Video /></Route>
          <Route exact path='/confirm'><Confirm /></Route>
          <Route exact path='/account'><Account /></Route>
          <Route exact path='/upload'><Upload /></Route>
          <Route exact path='/editor'><Editor /></Route>
          <Route exact path='/editor/:id'><EditVideo /></Route>
          <Route exact path='/u/:username'><UserProfile /></Route>
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
