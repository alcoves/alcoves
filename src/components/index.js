import React from 'react';

import Home from './home';
import Login from './login';
import Account from './account';
import Navigation from './navigation';

import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

function NoMatch() {
  return <h2>404</h2>;
}

function AppRouter() {
  return (
    <Router>
      <Navigation />
      <Switch>
        <Route exact path='/'>
          <Home />
        </Route>
        <Route exact path='/login'>
          <Login />
        </Route>
        <Route path='/account'>
          <Account />
        </Route>
        <Route component={NoMatch} />
      </Switch>
    </Router>
  );
}

export default function App({ children }) {
  return <AppRouter>{children}</AppRouter>;
}
