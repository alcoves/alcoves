import React from 'react';
import Title from './Title';
import PublishStatus from './PublishStatus';
import Button from '@material-ui/core/Button';
import ProcessingStatus from './ProcessingStatus';
import DeleteVideoButton from './DeleteVideoButton';
import Container from '@material-ui/core/Container';

import { gql } from 'apollo-boost';
import { Link, useParams } from 'react-router-dom';
import { useLazyQuery } from '@apollo/react-hooks';
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
        segments {
          done
          total
        }
      }
    }
  }
`;

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
        <Title id={data.video.id} />
        {/* <PublishStatus visability={data.video.visability} id={data.video.id} /> */}
        {Boolean(
          data.video.versions &&
            data.video.versions[0] &&
            Object.keys(data.video.versions[0]).length,
        ) && (
          <video
            controls
            width='100%'
            style={{ maxHeight: 410, background: 'black' }}
            src={data.video.versions[0].link}
          />
        )}
        <ProcessingStatus versions={data.video.versions} />
        <Grid container spacing={1} direction='row' justify='flex-end'>
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
