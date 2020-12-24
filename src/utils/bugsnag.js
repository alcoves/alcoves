import React from 'react';
import Bugsnag from '@bugsnag/js';
import LogRocket from 'logrocket';
import BugsnagPluginReact from '@bugsnag/plugin-react';

if (process.env.NODE_ENV === 'production') {
  Bugsnag.start({
    apiKey: '5afa8cfcc40ed672105826a20f3dcc05',
    plugins: [new BugsnagPluginReact(React)],
  });
  
  Bugsnag.beforeNotify = function (data) {
    data.metaData.sessionURL = LogRocket.sessionURL;
    return data;
  };
}

export default Bugsnag;