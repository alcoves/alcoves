import './Home.css';

import api from '../../api/api';
import UserStore from '../../data/User';
import React, { useContext } from 'react';

import { Loader } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';

const SidebarNav = observer(() => {
  const history = useHistory();
  const state = useObservable({
    followings: [],
    loading: true,
  });

  const loadFollowings = async () => {
    try {
      api({
        method: 'get',
        url: `/followings`,
      }).then(res => {
        console.log(res.data.payload);
        state.followings = res.data.payload;
        state.loading = false;
      });
    } catch (error) {
      console.error(error);
    }
  };

  const styles = {
    container: {
      backgroundColor: '#171B24',
      width: '200px',
      height: 'calc(100vh - 50px)',
    },
  };

  if (state.loading) {
    loadFollowings();
    return <div style={styles.container}> loading </div>;
  } else {
    return (
      <div style={styles.container}>
        <div style={{ paddingLeft: '10px' }}>
          <h5>Following</h5>
        </div>
        {state.followings.map(following => {
          console.log('following', following.followeeId.userName);
          return (
            <div
              onClick={() => {
                history.push(`/users/${following.followeeId._id}`);
              }}
              key={following._id}
              className='followerMenuItem'>
              <p>{following.followeeId.userName}</p>
            </div>
          );
        })}
      </div>
    );
  }
});

export default observer(() => {
  const user = useContext(UserStore);
  const history = useHistory();
  const state = useObservable({
    videos: [],
    loading: true,
  });

  if (state.loading) {
    api({
      method: 'get',
      url: `/videos`,
    }).then(res => {
      state.videos = res.data.payload;
      state.loading = false;
    });

    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  } else {
    return (
      <div style={{ display: 'flex', flexDirection: 'row' }}>
        <SidebarNav />
        <div>We are working on a new homepage!</div>{' '}
      </div>
    );
  }
});
