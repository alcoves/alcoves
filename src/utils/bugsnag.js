import React from 'react';
import Bugsnag from '@bugsnag/js';
import BugsnagPluginReact from '@bugsnag/plugin-react';
import getConfig from 'next/config';

const { BUGSNAG_API_KEY } = getConfig();

Bugsnag.start({
  apiKey: BUGSNAG_API_KEY,
  plugins: [new BugsnagPluginReact(React)],
});

export default Bugsnag;