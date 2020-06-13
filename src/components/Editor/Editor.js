import React from 'react';
import Title from './Title';
import PublishStatus from './PublishStatus';
import ProcessingStatus from './ProcessingStatus';

import { gql } from 'apollo-boost';
import { Link, useHistory, useParams } from 'react-router-dom';
import { useLazyQuery, useMutation } from '@apollo/react-hooks';
import { Button, Container, Loader, Icon } from 'semantic-ui-react';

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

const DELETE_VIDEO = gql`
  mutation deleteVideo($id: String!) {
    deleteVideo(id: $id)
  }
`;

function Editor() {
  const { id } = useParams();
  const history = useHistory();

  const [getVideo, { called, loading, data, error, refetch }] = useLazyQuery(GET_VIDEO, {
    variables: { id },
  });

  if (id && !called) getVideo();

  if (error) {
    console.error('error here', error);
    return <div> An error occured when loading the video </div>;
  }

  const DeleteVideoButton = ({ id }) => {
    const [deleteVideo, { loading, data }] = useMutation(DELETE_VIDEO, {
      variables: { id },
    });

    if (data) history.replace('/');

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
        {Boolean(
          data.video.versions &&
            data.video.versions[0] &&
            Object.keys(data.video.versions[0]).length,
        ) && (
          <div>
            <video
              controls
              width='100%'
              style={{ maxHeight: 410, background: 'black' }}
              src={data.video.versions[0].link}
            />
          </div>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ProcessingStatus id={data.video.id} />
          <div>
            <Button loading={loading} basic color='teal' onClick={() => refetch()}>
              Refresh
            </Button>
            <Button as={Link} to={`/videos/${data.video.id}`} basic color='teal'>
              View
            </Button>
            <DeleteVideoButton id={data.video.id} />
          </div>
        </div>
      </Container>
    );
  }

  return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
}

export default Editor;
