import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import theme from './config/theme';

import TopBar from './components/TopBar/TopBar';
import Content from './components/Content/Content';

import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';

const Index = () => {
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        <TopBar />
        <Switch>
          <Route path='/login' render={props => <SignUp {...props} />} />
          <Route path='/' render={props => <Content {...props} />} />
        </Switch>
      </ThemeProvider>
    </BrowserRouter>
  );
};

const App = document.getElementById('app');

ReactDOM.render(<Index />, App);
