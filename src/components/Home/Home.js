import React, { useContext } from 'react';
import api from '../../api/api';
import UserStore from '../../data/User';

import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';

const loadVideos = async userId => {
  return api({
    method: 'get',
    url: `/videos`,
  });
};

const styles = {
  card: {
    width: '320px',
    minWidth: '320px',
    maxWidth: '320px',
    cursor: 'pointer',
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
  },
  image: {
    objectFit: 'cover',
    minHeight: '180px',
    width: '320px',
  },
};

export default observer(() => {
  const history = useHistory();
  const user = useContext(UserStore);
  const state = useObservable({
    videos: [],
    loading: true,
  });

  if (state.loading) {
    loadVideos(user.id).then(res => {
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
            <div
              style={styles.card}
              key={video._id}
              onClick={() => history.push(`/videos/${video._id}`)}>
              <img style={styles.image} alt='thumbnail' src={video.media.thumbnail}></img>

              <div style={styles.meta}>
                <div style={styles.title}>{video.title}</div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
});
