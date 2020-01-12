import api from '../../api/api';
import UserStore from '../../data/User';
import React, { useContext } from 'react';

import { useHistory } from 'react-router-dom';
import { Loader, Button, Grid } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

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
    return <div> We are working on a new homepage! </div>;
  }
});
