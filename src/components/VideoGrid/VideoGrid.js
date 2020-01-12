import React from 'react';

import { useHistory } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';
import { observer, useObservable } from 'mobx-react-lite';

const styles = {
  card: {
    // minWidth: '320px',
    // width: '100%',
    maxWidth: '500px',
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

export default observer(props => {
  const history = useHistory();
  const state = useObservable({ videos: props.videos });

  return (
    <Grid centered doubling style={{ paddingTop: '30px' }}>
      {state.videos.map(video => {
        return (
          <Grid.Column key={video._id} mobile={14} tablet={10} computer={4} style={styles.card}>
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
                {props.isEditor && (
                  <Button.Group size='mini' color='teal' basic>
                    <Button
                      icon='setting'
                      onClick={() => {
                        history.push(`/editor/videos/${video._id}`);
                      }}
                    />
                  </Button.Group>
                )}
              </div>
            </div>
          </Grid.Column>
        );
      })}
    </Grid>
  );
});
