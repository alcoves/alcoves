import React from 'react';
import moment from 'moment';
import styled from 'styled-components';

import { Link } from 'react-router-dom';
import { Typography, Button, ButtonGroup, Grid, Paper, Avatar, Box } from '@material-ui/core';

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

function videoDuration(d) {
  if (d > 3600) {
    return moment.utc(d * 1000).format('H:mm:ss');
  } else {
    return moment.utc(d * 1000).format('m:ss');
  }
}

export default function VideoGrid({ videos = [], isEditor }) {
  return (
    <Grid container spacing={2} justify='center' style={{ paddingTop: '30px' }}>
      {videos.map(video => {
        return (
          <Grid item key={video.id}>
            <Paper elevation={3} style={{ width: 500 }}>
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
              <Grid container spacing={1} style={{ padding: 10 }}>
                <Grid item xs={2}>
                  <Avatar alt='avatar' src={video.user.avatar} />
                </Grid>
                <Grid item xs={10}>
                  <Box style={{ overflow: 'hidden' }}>
                    <Link to={`/videos/${video.id}`}>
                      <Typography className='block-ellipsis' varient='subtitle2'>
                        {video.title}
                      </Typography>
                    </Link>
                  </Box>
                  <Box display='flex'>
                    <Box flexGrow={1}>
                      <Link to={`/users/${video.user.id}`}>{video.user.userName}</Link>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Grid item>
                {isEditor && (
                  <ButtonGroup size='small' fullWidth variant='text'>
                    <Button component={Link} to={`/editor/${video.id}`}>
                      Edit
                    </Button>
                  </ButtonGroup>
                )}
              </Grid>
            </Paper>
          </Grid>
        );
      })}
    </Grid>
  );
}
