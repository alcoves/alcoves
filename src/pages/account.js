import React from 'react';
import gql from 'graphql-tag';
import Layout from '../components/Layout';

import { useUser } from '../data/User';
import { useRouter } from 'next/router'
import { useQuery } from '@apollo/react-hooks';
import { Button, Loader } from 'semantic-ui-react';

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

function Account() {
  const user = useUser();
  const router = useRouter();

  const { loading, data, error } = useQuery(QUERY, {
    variables: { id: user.id },
  });

  if (!user.isLoggedIn()) router.push('/login')
  if (loading) return <Loader active />;
  if (error) return <div> there was an error </div>;

  if (data) {
    console.log('data', data);
    return (
      <Layout>
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
            <div>
            </div>
            <div style={styles.displayName}>{data.user.displayName}</div>
            <div style={styles.profileFooter}>
              <Button basic fluid color='teal' onClick={() => user.logout(true)}>
                Logout
            </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  } else {
    return <div> Nothing found here </div>
  }
};

export default Account