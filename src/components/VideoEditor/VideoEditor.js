import Title from './Title';
import Link from 'next/link';
import gql from 'graphql-tag';
import PublishStatus from './PublishStatus';
import ProcessingStatus from './ProcessingStatus';

import React from 'react';
import { useRouter } from 'next/router';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Button, Container, Loader, Icon } from 'semantic-ui-react';

const GET_VIDEO = gql`
  query video($id: String!) {
    video(id: $id) {
      id
      title
      visability
    }
  }
`;

const DELETE_VIDEO = gql`
  mutation deleteVideo($id: String!) {
    deleteVideo(id: $id)
  }
`;

export default () => {
  const router = useRouter();

  const [getVideo, { called, loading, data, error, refetch }] = useLazyQuery(GET_VIDEO, {
    variables: { id: router.query.id },
  });

  if (router.query.id && !called) getVideo();

  if (error) {
    console.error('error here', error);
    return <div> An error occured when loading the video </div>;
  }

  const DeleteVideoButton = ({ id }) => {
    const [deleteVideo, { loading, data }] = useMutation(DELETE_VIDEO, {
      variables: { id },
    });

    if (data) router.replace('/');

    return (
      <Button basic negative onClick={deleteVideo} loading={loading}>
        <Icon name='trash' />
        Delete
      </Button>
    );
  };

  if (data) {
    return (
      <Container style={{ paddingTop: '50px' }}>
        <Title title={data.video.title} id={data.video.id} />
        <PublishStatus visability={data.video.visability} id={data.video.id} />
        <h3>{`video id: ${data.video.id}`}</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ProcessingStatus id={data.video.id} />
          <div>
            <Button loading={loading} basic color='teal' onClick={() => refetch()}>
              Refresh
            </Button>
            <Link href={`/videos/${data.video.id}`}>
              <Button basic color='teal'>
                View
              </Button>
            </Link>
            <DeleteVideoButton id={data.video.id} />
          </div>
        </div>
      </Container>
    );
  }

  return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
};
