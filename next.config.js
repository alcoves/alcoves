module.exports = {
  env: {
    REACT_APP_GIT_SHA: require('child_process').execSync('git rev-parse --short HEAD').toString(),
  },
};