import 'antd/dist/antd.css';
import './index.css';
import 'regenerator-runtime/runtime';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';

import { BrowserRouter } from 'react-router-dom';

const Index = () => {
  return (
    <BrowserRouter basename='/web'>
      <App />
    </BrowserRouter>
  );
};

const Root = document.getElementById('root');
ReactDOM.render(<Index />, Root);
