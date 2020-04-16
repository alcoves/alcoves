import React from 'react';
import gql from 'graphql-tag';
import withMe from '../lib/withMe';
import withApollo from '../lib/withApollo';
import Layout from '../components/Layout';
import Logout from '../components/Logout';
import Navigation from '../components/Navigation';

import { useQuery } from '@apollo/react-hooks';

const styles = {
  container: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: '20px',
  },
  card: {
    minWidth: '250px',
    width: '100%',
    maxWidth: '400px',
    padding: '10px',
    margin: '10px',
    borderRadius: '5px',
    backgroundColor: '#fff',
    overflow: 'hidden',
    WebkitBoxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
    MozBoxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
    boxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
  },
  avatarCircleContainer: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
  },
  avatarCircle: {
    width: '150px',
    height: '150px',
    borderRadius: '50%',
    backgroundColor: 'transparent',
    margin: '10px',
  },
  displayName: {
    display: 'flex',
    alignItems: 'center',
    flexDirection: 'column',
    justifyContent: 'center',
    margin: '1em',
    fontSize: '2.6em',
    lineHeight: '1.3em',
    fontWeight: '700',
  },
  profileFooter: {
    display: 'flex',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
};

const QUERY = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      avatar
      displayName
    }
  }
`;

function Account({ id }) {
  const { loading, data, error } = useQuery(QUERY, { variables: { id } });

  if (data) {
    return (
      <div style={styles.container}>
        <div style={styles.card}>
          <div style={styles.avatarCircleContainer}>
            {data.user.avatar ? (
              <img
                alt='profile'
                src={`${data.user.avatar}?${Date.now()}`}
                style={styles.avatarCircle}
              />
            ) : (
              <div style={styles.avatarCircle} />
            )}
          </div>
          <div></div>
          <div style={styles.displayName}>{data.user.displayName}</div>
          <div style={styles.profileFooter}>
            <Logout />
          </div>
        </div>
      </div>
    );
  }

  return <div />;
}

function AccountWrapper() {
  const me = withMe();
  if (me) {
    return (
      <Layout>
        <Navigation />
        <Account id={me.id} />
      </Layout>
    );
  }

  return (
    <Layout>
      <Navigation />
      <h1>Hey you need an account!</h1>
    </Layout>
  );
}

export default withApollo({ ssr: true })(AccountWrapper);
