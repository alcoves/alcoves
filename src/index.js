import 'regenerator-runtime/runtime';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App/App';

import { BrowserRouter } from 'react-router-dom';

const Index = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

const Root = document.getElementById('root');
ReactDOM.render(<Index />, Root);
