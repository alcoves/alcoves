import React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';

const { BUGSNAG_API_KEY } = process.env;

Bugsnag.start({
  apiKey: BUGSNAG_API_KEY,
  plugins: [new BugsnagPluginReact(React)],
});

export default Bugsnag;