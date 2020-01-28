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
    overflow: 'hidden',
    backgroundColor: '#fff',
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
          <Grid.Column key={video.id} mobile={14} tablet={10} computer={4} style={styles.card}>
            <img
              style={styles.image}
              alt='thumbnail'
              src={video.thumbnail}
              onClick={() => history.push(`/videos/${video.id}`)}></img>
            <div style={styles.meta}>
              <div onClick={() => history.push(`/videos/${video.id}`)} style={styles.title}>
                {video.title}
              </div>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  height: '30px',
                  cursor: 'pointer',
                }}>
                <img
                  style={{ borderRadius: '50%' }}
                  src={video.user.avatar}
                  height={30}
                  width={30}
                  onClick={() => history.push(`/users/${video.user.id}`)}
                />
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    height: '100%',
                    paddingLeft: '5px',
                    fontWeight: '600',
                    opacity: '.6',
                    textTransform: 'uppercase',
                    fontSize: '.9em',
                    letterSpacing: '.05em',
                    flexGrow: 1,
                  }}
                  onClick={() => history.push(`/users/${video.user.id}`)}>
                  {video.user.displayName}
                </div>
                <div>
                  {props.isEditor && (
                    <Button
                      icon='setting'
                      size='mini'
                      color='teal'
                      basic
                      onClick={() => {
                        history.push(`/editor/videos/${video.id}`);
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </Grid.Column>
        );
      })}
    </Grid>
  );
});
