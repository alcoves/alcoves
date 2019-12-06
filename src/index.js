import './index.css';
import 'antd/dist/antd.css';
import React from 'react';
import ReactDOM from 'react-dom';

import App from './components/App/App';

import { BrowserRouter } from 'react-router-dom';
import { CookiesProvider } from 'react-cookie';

import User from './data/User';

const Index = props => {
  return (
    <CookiesProvider>
      <BrowserRouter>
        <App stores={{ user: User }} />
      </BrowserRouter>
    </CookiesProvider>
  );
};

const Root = document.getElementById('root');
ReactDOM.render(<Index />, Root);
