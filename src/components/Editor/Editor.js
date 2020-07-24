import React from 'react';
import Title from './Title';
import PublishStatus from './PublishStatus';
import Button from '@material-ui/core/Button';
import ProcessingStatus from './ProcessingStatus';
import DeleteVideoButton from './DeleteVideoButton';
import Container from '@material-ui/core/Container';

import { Link, useParams } from 'react-router-dom';
import { gql, useLazyQuery } from '@apollo/client';
import { CircularProgress, Grid } from '@material-ui/core';

const GET_VIDEO = gql`
  query video($id: String!) {
    video(id: $id) {
      id
      title
      thumbnail
      visability
      versions {
        link
        status
        preset
        percentCompleted
      }
    }
  }
`;

function VideoPlayer({ versions }) {
  const playableLinks = versions.filter(v => {
    return Boolean(v && v.link);
  });

  if (playableLinks[0] && playableLinks[0].link) {
    return (
      <video
        controls
        width='100%'
        style={{ maxHeight: 410, background: 'black' }}
        src={playableLinks[0].link}
      />
    );
  }

  return <div />;
}

function Editor() {
  const { id } = useParams();

  const [getVideo, { called, loading, data, error, startPolling }] = useLazyQuery(GET_VIDEO, {
    variables: { id },
  });

  if (id && !called) getVideo();

  if (error) {
    console.error('error here', error);
    return <div> An error occured when loading the video </div>;
  }

  if (data) {
    startPolling(3000);
    return (
      <Container maxWidth='md' style={{ paddingTop: '15px' }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={4}>
            {data.video.thumbnail && (
              <img
                style={{
                  borderRadius: '5px',
                  margin: '10px 0px 10px 0px',
                  background: 'grey',
                }}
                width='100%'
                src={data.video.thumbnail}
              />
            )}
          </Grid>
          <Grid item xs={12} sm={8}>
            <Title id={data.video.id} />
          </Grid>
        </Grid>
        {/* <PublishStatus visability={data.video.visability} id={data.video.id} /> */}
        <VideoPlayer versions={data.video.versions} />
        <ProcessingStatus versions={data.video.versions} />
        <Grid
          container
          spacing={1}
          direction='row'
          justify='space-between'
          style={{ marginTop: '5px' }}>
          <Grid item>
            <DeleteVideoButton id={data.video.id} />
          </Grid>
          <Grid item>
            <Button
              color='primary'
              component={Link}
              variant='outlined'
              to={`/videos/${data.video.id}`}>
              View
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return <CircularProgress disabled={loading} />;
}

export default Editor;
