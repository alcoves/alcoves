import React from 'react';
import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { Button, Grid } from 'semantic-ui-react';

const Duration = styled.div`
  right: 0;
  bottom: 0;
  z-index: 0;
  color: white;
  font-size: 12px;
  font-weight: 600;
  position: absolute;
  border-radius: 3px;
  margin: 0px 3px 3px 0px;
  padding: 0px 3px 0px 3px;
  background: rgba(0, 0, 0, 0.7);
`;

const styles = {
  card: {
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

function videoDuration(duration) {
  if (duration) {
    const durationFmt = (duration / 100).toFixed(2).toString();
    return durationFmt.replace('.', ':');
  }

  return null;
}

export default function VideoGrid({ videos = [], isEditor }) {
  return (
    <Grid centered doubling style={{ paddingTop: '30px' }}>
      {videos.map(video => {
        return (
          <Grid.Column key={video.id} mobile={14} tablet={10} computer={4} style={styles.card}>
            <Link to={`/videos/${video.id}`}>
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
                  backgroundPosition: 'center',
                }}>
                <Duration>{videoDuration(video.duration)}</Duration>
              </div>
            </Link>
            <div style={styles.meta}>
              <Link to={`/videos/${video.id}`}>{video.title}</Link>
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
                <Link to={`/users/${video.user.id}`}>{video.user.userName}</Link>
                <div>
                  {isEditor && (
                    <Link to={`/editor/${video.id}`}>
                      <Button icon='setting' size='mini' color='teal' basic />
                    </Link>
                  )}
                </div>
              </div>
            </div>
          </Grid.Column>
        );
      })}
    </Grid>
  );
}
