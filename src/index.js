import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import theme from './config/theme';

import App from './components/App/App';

import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider } from '@material-ui/core/styles';
import { CookiesProvider } from 'react-cookie';

import User from './data/User';

const Index = props => {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <ThemeProvider theme={theme}>
          <App stores={{ user: User }} />
        </ThemeProvider>
      </BrowserRouter>
    </CookiesProvider>
  );
};

const Root = document.getElementById('root');
ReactDOM.render(<Index />, Root);
