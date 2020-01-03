import api from '../../api/api';
import UserStore from '../../data/User';
import React, { useContext } from 'react';

import { useHistory } from 'react-router-dom';
import { Loader, Button, Grid } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

const styles = {
  card: {
    width: '100%',
    minWidth: '320px',
    maxWidth: '320px',
    padding: 0,
    margin: '10px',
    borderRadius: '5px',
    backgroundColor: '#272d3c',
    color: 'white',
    overflow: 'hidden',
    WebkitBoxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
    MozBoxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
    boxShadow: '3px 8px 42px -8px rgba(0,0,0,0.48)',
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
    width: '100%',
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
  const user = useContext(UserStore);
  const history = useHistory();
  const state = useObservable({
    videos: [],
    loading: true,
  });

  if (!user.isLoggedIn()) {
    return <p> You must login to view this page </p>;
  } else if (state.loading) {
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
      <Grid container centered columns={4} style={{ paddingTop: '30px' }}>
        {state.videos.length ? (
          state.videos.map(video => {
            return (
              <Grid.Column key={video._id} style={styles.card}>
                <img
                  style={styles.image}
                  alt='thumbnail'
                  src={video.thumbnail}
                  onClick={() => history.push(`/videos/${video._id}`)}></img>
                <div style={styles.meta}>
                  <div onClick={() => history.push(`/videos/${video._id}`)} style={styles.title}>
                    {video.title}
                  </div>
                  <div style={styles.cardFooter}>
                    <Button.Group size='mini' color='teal' basic>
                      <Button
                        icon='setting'
                        onClick={() => {
                          history.push(`/editor/videos/${video._id}`);
                        }}
                      />
                    </Button.Group>
                  </div>
                </div>
              </Grid.Column>
            );
          })
        ) : (
          <h1>You don't have any videos</h1>
        )}
      </Grid>
    );
  }
});
