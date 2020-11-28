import React from 'react';

import { Typography, } from '@material-ui/core';
import { Switch, Route, } from 'react-router-dom';
import Login from './pages/login';
import Home from './pages/index';
import Video from './pages/video';
import Footer from './components/Footer';
import Account from './pages/account/index';
import Confirm from './components/Confirm';
import UserProfile from './pages/user/index';
import Register from './pages/register';
import EditorHome from './components/EditorHome';
import Navigation from './components/Navigation';
import Uploader from './components/Uploader/Index';
import EditVideo from './components/EditVideo/Index';
import SearchResults from './components/SearchResults';

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
          <Route exact path='/editor'><EditorHome /></Route>
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
