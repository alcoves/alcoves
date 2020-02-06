import React from 'react';
import { gql } from 'apollo-boost';
import { Link, useHistory } from 'react-router-dom';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button, Container, Loader, Icon } from 'semantic-ui-react';

import Title from './Title';
import ProcessingStatus from './ProcessingStatus';

const DeleteVideoButton = ({ id }) => {
  const history = useHistory();
  const DELETE_VIDEO = gql`
    mutation deleteVideo($id: ID!) {
      deleteVideo(id: $id)
    }
  `;

  const [deleteVideo, { loading, data }] = useMutation(DELETE_VIDEO, {
    variables: { id },
  });

  if (data) history.goBack();
  return (
    <Button basic negative onClick={deleteVideo} loading={loading}>
      <Icon name='trash' />
      Delete
    </Button>
  );
};

export default ({ match }) => {
  const GET_VIDEO = gql`
    {
      video(id: "${match.params.videoId}") {
        id
        title
        status
        createdAt
      }
    }
  `;

  const { loading, data, error } = useQuery(GET_VIDEO);

  if (loading) {
    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  }

  if (error) {
    console.error('error here', error);
    return <div> An error occured when loading the video </div>;
  }

  if (data) {
    return (
      <Container style={{ paddingTop: '50px' }}>
        <Title title={data.video.title} id={data.video.id} />
        <h3>{`video id: ${data.video.id} | status: ${data.video.status}`}</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ProcessingStatus id={match.params.videoId} />
          <div>
            <Button as={Link} to={`/videos/${data.video.id}`} basic color='teal'>
              View
            </Button>
            <DeleteVideoButton id={match.params.videoId} />
          </div>
        </div>
      </Container>
    );
  }
};
