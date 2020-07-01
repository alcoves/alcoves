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
      visability
      versions {
        link
        preset
      }
    }
  }
`;

function Editor() {
  const { id } = useParams();

  const [getVideo, { called, loading, data, error, refetch }] = useLazyQuery(GET_VIDEO, {
    variables: { id },
  });

  if (id && !called) getVideo();

  if (error) {
    console.error('error here', error);
    return <div> An error occured when loading the video </div>;
  }

  if (data) {
    return (
      <Container maxWidth='md' style={{ paddingTop: '50px' }}>
        <Title title={data.video.title} id={data.video.id} />
        <PublishStatus visability={data.video.visability} id={data.video.id} />
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
        <ProcessingStatus id={data.video.id} />
        <Grid container spacing={1} direction='row' justify='flex-end'>
          <Grid item>
            <DeleteVideoButton id={data.video.id} />
          </Grid>
          <Grid item>
            <Button color='primary' disabled={loading} variant='outlined' onClick={() => refetch()}>
              Refresh
            </Button>
          </Grid>
          <Grid item>
            <Button variant='outlined' as={Link} to={`/videos/${data.video.id}`} color='primary'>
              View
            </Button>
          </Grid>
        </Grid>
      </Container>
    );
  }

  return <CircularProgress />;
}

export default Editor;
