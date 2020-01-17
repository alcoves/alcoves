import './Home.css';

import api from '../../api/api';
import React from 'react';

import { Loader } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

export default observer(() => {
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
        <div>We are working on a new homepage!</div>{' '}
      </div>
    );
  }
});
