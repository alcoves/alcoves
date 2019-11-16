import './index.css';
import React from 'react';
import ReactDOM from 'react-dom';
import theme from './config/theme';

import TopBar from './components/TopBar/TopBar';
import Content from './components/Content/Content';

import { ThemeProvider } from '@material-ui/core/styles';

const Index = () => {
  return (
    <ThemeProvider theme={theme}>
      <TopBar />
      <Content />
    </ThemeProvider>
  );
};

const App = document.getElementById('app');

ReactDOM.render(<Index />, App);
