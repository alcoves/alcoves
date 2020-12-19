const REACT_APP_GIT_SHA = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();

const { BUGSNAG_API_KEY } = process.env;

module.exports = {
  env: {
    REACT_APP_GIT_SHA,
    BUGSNAG_API_KEY,
  },
};