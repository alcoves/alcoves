import React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

Bugsnag.start({
  apiKey: '5afa8cfcc40ed672105826a20f3dcc05',
  plugins: [new BugsnagPluginReact(React)],
});

export default Bugsnag;