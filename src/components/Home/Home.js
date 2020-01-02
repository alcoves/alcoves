import React, { useContext } from 'react';
import api from '../../api/api';
import UserStore from '../../data/User';

import { Icon } from 'antd';
import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';

const styles = {
  card: {
    width: '320px',
    minWidth: '320px',
    maxWidth: '320px',
    margin: '10px',
    borderRadius: '5px',
    backgroundColor: '#272d3c',
    color: 'white',
    overflow: 'hidden',
  },
  row: {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: '10px',
  },
  meta: {
    height: '100px',
    padding: '10px',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',
  },
  title: {
    fontSize: '1.1em',
    cursor: 'pointer',
    height: '50px',
  },
  image: {
    objectFit: 'cover',
    minHeight: '180px',
    maxHeight: '180px',
    width: '320px',
    cursor: 'pointer',
  },
  cardFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
};

export default observer(() => {
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
    return (
      <div>
        <h1> Loading </h1>
      </div>
    );
  } else {
    return (
      <div style={styles.row}>
        {state.videos.map(video => {
          return (
            <div style={styles.card} key={video._id}>
              <img
                style={styles.image}
                alt='thumbnail'
                src={video.media.thumbnail}
                onClick={() => history.push(`/videos/${video._id}`)}></img>
              <div style={styles.meta}>
                <div onClick={() => history.push(`/videos/${video._id}`)} style={styles.title}>
                  {video.title}
                </div>
                <div style={styles.cardFooter}>
                  <Icon
                    onClick={() => {
                      history.push(`/editor/videos/${video._id}`);
                    }}
                    style={{ cursor: 'pointer', fontSize: '1.3em' }}
                    type='setting'
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
});
