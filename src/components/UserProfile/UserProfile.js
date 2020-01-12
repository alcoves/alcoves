import api from '../../api/api';
import UserStore from '../../data/User';
import React, { useContext } from 'react';

import { useHistory } from 'react-router-dom';
import { Loader, Button, Grid } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

import VideoGrid from '../VideoGrid/VideoGrid';

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
        console.log(res);
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

export default observer(props => {
  const user = useContext(UserStore);
  const history = useHistory();
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
        console.log(res);
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
            }}
          />
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              margin: '0px 20px 0px 20px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              flexDirection: 'column',
            }}>
            <h2> {state.user.userName} </h2>
            <div>
              <Button disabled>Subscribe</Button>
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
