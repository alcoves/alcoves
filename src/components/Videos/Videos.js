import React, { useContext } from 'react';
import UserStore from '../../data/User';
import api from '../../api/api';

import { Spin, Icon } from 'antd';
import { observer, useObservable } from 'mobx-react-lite';

const loadVideos = async userId => {
  if (userId) {
    const { data } = await api({
      method: 'get',
      url: `/videos`,
    });

    console.log('data', data.payload);
  }
};

export default observer(() => {
  const user = useContext(UserStore);
  const state = useObservable({
    loading: false,
    videos: [],
  });

  loadVideos(user.id).then(() => {
    console.log('done');
  });

  if (state.loading) {
    return (
      <div>
        <Spin indicator={<Icon type='loading' style={{ fontSize: 24 }} spin />} />
      </div>
    );
  }
  return (
    <div>
      <h1> Your Videos </h1>
    </div>
  );
});
