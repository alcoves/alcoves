import { gql } from 'apollo-boost';
import { useQuery } from '@apollo/react-hooks';
import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { Button, Loader } from 'semantic-ui-react';
import UserStore from '../../data/User';

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

const loginQuery = gql`
  query user($id: ID!) {
    user(id: $id) {
      id
      avatar
      displayName
    }
  }
`;

export default () => {
  const user = useContext(UserStore);

  const { loading, data, error } = useQuery(loginQuery, {
    variables: { id: user.id },
  });

  if (!user.isLoggedIn()) {
    return <Redirect to='/login' />;
  }

  if (loading) return <Loader active />;

  if (error) {
    console.log('error', error);
    return <div> there was an error </div>;
  }

  if (data) {
    console.log('data', data);
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
          <div>
            {/* <div style={{ display: 'flex', justifyContent: 'center' }}>
              <Button
                circular
                basic
                loading={data.uploadLoading}
                color='teal'
                size='tiny'
                onClick={() => fileInputRef.current.click()}>
                <Icon name='camera' />
              </Button>
              <input
                ref={fileInputRef}
                type='file'
                name='avatar'
                accept='image/jpeg'
                hidden
                onChange={onChangeHandler}
              />
            </div> */}
          </div>
          <div style={styles.displayName}>{data.user.displayName}</div>
          <div style={styles.profileFooter}>
            <Button basic fluid color='teal' onClick={() => user.logout(true)}>
              Logout
            </Button>
          </div>
        </div>
      </div>
    );
  }
};

// const onChangeHandler = async event => {
//   try {
//     data.uploadLoading = true;
//     const data = new FormData();
//     data.append('avatar', event.target.files[0]);
//     await api({
//       data,
//       method: 'post',
//       url: `/users/${user.id}/avatars`,
//       headers: { 'Content-Type': 'multipart/form-data' },
//     });
//     await loadUser();
//   } catch (error) {
//     console.error(error);
//   } finally {
//     data.uploadLoading = false;
//   }
// };

// const fileInputRef = React.createRef();
