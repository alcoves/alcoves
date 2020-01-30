import React from 'react';
import { gql } from 'apollo-boost';
import ProcessingStatus from './ProcessingStatus';

import { useHistory, Redirect } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { Button, Container, Input, Loader, Icon } from 'semantic-ui-react';

const DeleteVideoButton = props => {
  const DELETE_VIDEO = gql`
    mutation deleteVideo($id: ID!) {
      deleteVideo(id: $id)
    }
  `;

  const [deleteVideo, { loading, data }] = useMutation(DELETE_VIDEO, {
    variables: {
      id: props.id,
    },
  });

  if (data) return <Redirect to='/' />;
  return (
    <Button basic negative onClick={deleteVideo} loading={loading}>
      <Icon name='trash' />
      Delete
    </Button>
  );
};

export default observer(props => {
  const history = useHistory();
  const state = useObservable({ changes: {} });

  const GET_VIDEO = gql`
    {
      video(id: "${props.match.params.videoId}") {
        id
        title
        status
        createdAt
      }
    }
  `;

  const SAVE_VIDEO = gql`
    mutation updateVideo($id: ID!, $input: UpdateVideoInput!) {
      updateVideo(id: $id, input: $input) {
        id
      }
    }
  `;

  const { loading, data, error } = useQuery(GET_VIDEO);

  const [saveVideo, { loading: saveLoading }] = useMutation(SAVE_VIDEO, {
    variables: { id: props.match.params.videoId, input: state.changes },
  });

  const handleChange = (e, { name, value }) => {
    state.changes[name] = value;
  };

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
        <div>
          <Input
            name='title'
            fluid
            size='huge'
            onChange={handleChange}
            value={state.changes.title !== undefined ? state.changes.title : data.video.title}
          />
        </div>
        <h3>
          video id: {data.video.id} | status: {data.video.status}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* <ProcessingStatus videoId={props.match.params.videoId} /> */}
          <div>
            <Button
              loading={saveLoading}
              disabled={!Object.keys(state.changes).length}
              basic
              color='teal'
              onClick={saveVideo}>
              Save
            </Button>
            <Button
              basic
              color='teal'
              onClick={() => {
                history.push(`/videos/${data.video.id}`);
              }}>
              View
            </Button>
            <DeleteVideoButton id={props.match.params.videoId} />
          </div>
        </div>
      </Container>
    );
  }
});
