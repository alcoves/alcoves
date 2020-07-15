import userPool from '../lib/userPool';
import { ApolloClient, InMemoryCache } from '@apollo/client';

function serverUrl() {
  if (window.location.hostname === 'dev.bken.io') {
    return 'https://yuyqovofb3.execute-api.us-east-2.amazonaws.com/graphql';
  } else if (window.location.hostname === 'bken.io') {
    return 'https://1y7s6s24t2.execute-api.us-east-2.amazonaws.com/graphql';
  } else {
    return 'http://localhost:4000/graphql';
  }
}

const client = new ApolloClient({
  // https://www.apollographql.com/blog/announcing-the-release-of-apollo-client-3-0/
  cache: new InMemoryCache(),
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
