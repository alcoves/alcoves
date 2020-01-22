import api from '../../api/api';
import UserStore from '../../data/User';
import React, { useContext } from 'react';
import VideoGrid from '../VideoGrid/VideoGrid';

import { Loader, Button } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

const Videos = observer(props => {
  const user = useContext(UserStore);
  const state = useObservable({
    videos: [],
    loading: true,
  });

  if (state.loading) {
    api({
      method: 'get',
      url: `/users/${props.userId}/videos`,
    })
      .then(res => {
        console.log('videos query', res);
        state.videos = res.data.payload;
        state.loading = false;
      })
      .catch(error => {
        console.log(error);
      });

    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  } else {
    return <VideoGrid videos={state.videos} isEditor={Boolean(props.userId === user.id)} />;
  }
});

const FollowButton = observer(props => {
  const user = useContext(UserStore);
  const state = useObservable({
    loading: false,
    isFollowing: false,
  });

  const handleFollow = async () => {
    try {
      await api({
        method: 'post',
        url: '/followings',
        data: { followee: props.followee },
      });

      await loadButton();
    } catch (error) {
      console.error(error);
    }
  };

  const handleUnfollow = async () => {
    try {
      await api({
        method: 'delete',
        url: '/followings',
        data: { followee: props.followee },
      });

      await loadButton();
    } catch (error) {
      console.error(error);
    }
  };

  const loadButton = async () => {
    state.isFollowing = false;
    state.loading = true;

    api({
      method: 'get',
      url: `/followings`,
    })
      .then(res => {
        res.data.payload.map(following => {
          console.log('following', following);
          if (props.followee === following.followee._id) state.isFollowing = true;
        });

        state.loading = false;
      })
      .catch(error => {
        console.log(error);
      });

    return null;
  };

  if (user.id === props.followee) {
    return null;
  } else if (!state.loading) {
    loadButton();
  } else {
    if (state.isFollowing) {
      return (
        <Button basic color='teal' onClick={handleUnfollow}>
          Unfollow
        </Button>
      );
    } else {
      return (
        <Button basic color='teal' onClick={handleFollow}>
          Follow
        </Button>
      );
    }
  }
});

export default observer(props => {
  const state = useObservable({
    user: null,
    loading: true,
  });

  if (state.loading) {
    api({
      method: 'get',
      url: `/users/${props.match.params.userId}`,
    })
      .then(res => {
        console.log('users query', res);
        state.user = res.data.payload;
        state.loading = false;
      })
      .catch(error => {
        console.log(error);
      });

    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  } else if (state.user) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div style={{ position: 'relative' }}>
          <div
            style={{
              width: '100%',
              height: '300px',
              backgroundSize: 'cover',
              backgroundPosition: 'center center',
              backgroundRepeat: 'no-repeat',
              backgroundImage: `radial-gradient(circle, rgba(255,255,255,.1) 0%, rgba(0,0,0,.7) 100%)`,
            }}>
            <div
              style={{
                width: '100%',
                height: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
              }}>
              <h2> {state.user.displayName} </h2>
              <FollowButton followee={props.match.params.userId} />
            </div>
          </div>
        </div>
        <div style={{ padding: '5px 20px 20px 20px' }}>
          <Videos userId={props.match.params.userId} />
        </div>
      </div>
    );
  }
});
