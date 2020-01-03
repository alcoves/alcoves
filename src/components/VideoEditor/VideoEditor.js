import React from 'react';
import api from '../../api/api';

import { Button } from 'semantic-ui-react';
import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';

export default observer(props => {
  const history = useHistory();
  const state = useObservable({
    video: {},
    loading: true,
  });

  const handleRefresh = async () => {
    try {
      const { data } = await api({
        method: 'get',
        url: `/videos/${props.match.params.videoId}`,
      });

      state.video = data.payload;
      state.loading = false;
    } catch (error) {
      console.error(error);
      state.loading = false;
    }
  };

  const handleDelete = async e => {
    try {
      await api({
        method: 'delete',
        url: `/videos/${e.target.id}`,
      });

      history.push('/');
    } catch (error) {
      throw error;
    }
  };

  const handleView = e => {
    history.push(`/videos/${e.target.id}`);
  };

  if (state.loading) {
    handleRefresh();

    return (
      <div>
        <h1>loading</h1>
      </div>
    );
  } else {
    return (
      <div>
        <Button type='default' onClick={handleRefresh}>
          Refresh
        </Button>
        <div
          style={{
            width: '400px',
            height: 'auto',
            backgroundColor: 'rgb(0, 21, 41)',
            border: 'solid white 1px',
            margin: '10px',
            padding: '10px',
          }}>
          <h1>{state.video.title}</h1>
          <h5>Video ID : {state.video._id}</h5>
          <h5>Authord ID : {state.video.author}</h5>
          <p>
            Status:
            {state.video.status}
          </p>
          {state.video.media &&
            Object.entries(state.video.media).map(([k, v]) => {
              return <p key={k}>{k}</p>;
            })}
          <Button id={state.video._id} type='primary' onClick={handleView}>
            View
          </Button>
          <Button id={state.video._id} type='danger' onClick={handleDelete}>
            Delete
          </Button>
        </div>
      </div>
    );
  }
});
