import React from 'react';
import api from '../../api/api';
import ProcessingStatus from './ProcessingStatus';

import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';
import { Button, Container, Input, Loader } from 'semantic-ui-react';

export default observer(props => {
  const history = useHistory();
  const state = useObservable({
    video: {},
    videoQueryLoading: true,
    saveButtonLoading: false,
    videoHasChanged: false,
  });

  const loadVideo = async () => {
    try {
      const { data } = await api({
        method: 'get',
        url: `/videos/${props.match.params.videoId}`,
      });

      state.video = data.payload;
      state.videoQueryLoading = false;
    } catch (error) {
      console.error(error);
      state.videoQueryLoading = false;
    }
  };

  const handleDelete = async e => {
    try {
      await api({
        method: 'delete',
        url: `/videos/${e.target.id}`,
      });

      history.push('/');
    } catch (error) {
      throw error;
    }
  };

  const handleChange = (e, { name, value }) => {
    state.videoHasChanged = true;
    state.video[name] = value;
  };

  const handleSave = async e => {
    try {
      await api({
        method: 'patch',
        url: `/videos/${state.video._id}`,
        data: {
          title: state.video.title,
        },
      });

      state.videoHasChanged = false;
    } catch (error) {
      console.error(error);
    }
  };

  if (state.videoQueryLoading) {
    loadVideo();
    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  } else {
    return (
      <Container style={{ paddingTop: '50px' }}>
        <div>
          <Input name='title' fluid size='huge' onChange={handleChange} value={state.video.title} />
        </div>
        <h3>
          video id: {state.video._id} | status: {state.video.status}
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <ProcessingStatus videoId={props.match.params.videoId} />
          <div>
            <Button disabled={!state.videoHasChanged} basic color='teal' onClick={handleSave}>
              Save
            </Button>
            <Button
              basic
              color='teal'
              onClick={() => {
                history.push(`/videos/${state.video._id}`);
              }}>
              View
            </Button>
            <Button basic negative onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Container>
    );
  }
});
