const REACT_APP_GIT_SHA = require('child_process')
  .execSync('git rev-parse --short HEAD')
  .toString();
  
module.exports = {
  env: {
    REACT_APP_GIT_SHA,
    // NEXTAUTH_URL: "https://bken.io"
  },
};