import 'regenerator-runtime/runtime';
import 'semantic-ui-css/semantic.min.css';
import './index.css';

import React from 'react';
import ReactGA from 'react-ga';
import ReactDOM from 'react-dom';
import App from './components/App/App';

ReactGA.initialize('UA-77834417-2');

const Root = document.getElementById('root');
ReactDOM.render(<App />, Root);
