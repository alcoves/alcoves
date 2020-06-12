import userPool from '../lib/userPool';
import ApolloClient from 'apollo-boost';

function serverUrl() {
  if (process.env.BKEN_ENV === 'dev') {
    return 'https://tf8lrfozkk.execute-api.us-east-1.amazonaws.com/dev/graphql';
  } else if (process.env.BKEN_ENV === 'prod') {
    return 'https://tf8lrfozkk.execute-api.us-east-1.amazonaws.com/graphql';
  } else {
    return 'http://localhost:4000/graphql';
  }
}

const client = new ApolloClient({
  uri: serverUrl(),
  request: operation => {
    const cognitoUser = userPool.getCurrentUser();

    if (cognitoUser) {
      cognitoUser.getSession(function (err, session) {
        if (err) console.error('failed to get token from cognito user session');
        if (session.isValid()) {
          const token = session.accessToken.jwtToken;
          operation.setContext({
            headers: {
              authorization: token ? `Bearer ${token}` : '',
            },
          });
        } else {
          console.error('invalid user session');
        }
      });
    }
  },
});

export default client;
