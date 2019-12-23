import React from 'react';

import { Spin, Icon } from 'antd';
import { observer, useObservable } from 'mobx-react-lite';

export default observer(() => {
  const state = useObservable({
    loading: false,
    videos: [],
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
