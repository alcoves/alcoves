import React from 'react';
import { Link } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';

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
  cardFooter: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
};

const videoDuration = duration => {
  if (duration) {
    const durationFmt = (duration / 100).toFixed(2).toString();
    return durationFmt.replace('.', ':');
  }

  return null;
};

export default ({ videos, isEditor }) => {
  return (
    <Grid centered doubling style={{ paddingTop: '30px' }}>
      {videos.map(video => {
        return (
          <Grid.Column key={video.id} mobile={14} tablet={10} computer={4} style={styles.card}>
            <Link to={`/videos/${video.id}`} style={styles.title}>
              <div
                style={{
                  width: '100%',
                  cursor: 'pointer',
                  minHeight: '180px',
                  maxHeight: '180px',
                  position: 'relative',
                  backgroundColor: 'grey',
                  backgroundSize: 'cover',
                  backgroundRepeat: 'no-repeat',
                  backgroundImage: `url("${video.thumbnail}")`,
                }}>
                <div
                  style={{ position: 'absolute', bottom: 0, right: 0, zIndex: 10, color: 'white' }}>
                  {videoDuration(video.duration)}
                </div>
              </div>
            </Link>
            <div style={styles.meta}>
              <Link to={`/videos/${video.id}`} style={styles.title}>
                {video.title}
              </Link>
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  height: '30px',
                  marginTop: '10px',
                  cursor: 'pointer',
                }}>
                <Link to={`/users/${video.user.id}`}>
                  <img
                    style={{ borderRadius: '50%' }}
                    src={video.user.avatar}
                    height={30}
                    width={30}
                    alt='avatar'
                  />
                </Link>
                <Link
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
                  to={`/users/${video.user.id}`}>
                  {video.user.displayName}
                </Link>
                <div>
                  {isEditor && (
                    <Button
                      as={Link}
                      to={`/editor/videos/${video.id}`}
                      icon='setting'
                      size='mini'
                      color='teal'
                      basic
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
};
