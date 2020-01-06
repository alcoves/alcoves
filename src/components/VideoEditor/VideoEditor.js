import api from '../../api/api';
import React, { useState } from 'react';
import useInterval from '../../lib/useInterval';

import { useHistory } from 'react-router-dom';
import { observer, useObservable } from 'mobx-react-lite';
import { Button, Label, Icon, Container } from 'semantic-ui-react';

function timeConversion(startTime, completeTime) {
  const millisec = new Date(completeTime).getTime() - new Date(startTime).getTime();
  const seconds = (millisec / 1000).toFixed(1);
  const minutes = (millisec / (1000 * 60)).toFixed(1);
  const hours = (millisec / (1000 * 60 * 60)).toFixed(1);
  const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) {
    return seconds + ' Sec';
  } else if (minutes < 60) {
    return minutes + ' Min';
  } else if (hours < 24) {
    return hours + ' Hrs';
  } else {
    return days + ' Days';
  }
}

export default observer(props => {
  const history = useHistory();
  const state = useObservable({
    video: {},
    loading: true,
  });

  const handleRefresh = async () => {
    try {
      const { data } = await api({
        method: 'get',
        url: `/videos/${props.match.params.videoId}`,
      });

      state.video = data.payload;
      state.loading = false;
    } catch (error) {
      console.error(error);
      state.loading = false;
    }
  };

  if (state.loading === true) {
    handleRefresh();
  }

  useInterval(() => {
    if (state.video.status !== 'completed') {
      handleRefresh();
    }
  }, 3000);

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

  const handleView = e => {
    history.push(`/videos/${e.target.id}`);
  };

  const renderFiles = () => {
    return Object.entries(state.video.files).map(([quality, fileObj]) => {
      return (
        <div key={quality} style={{ margin: '5px 0px 5px 0px' }}>
          <Label as='a' color='grey'>
            {fileObj.status === 'completed' ? (
              <Icon color='green' name='check circle outline' />
            ) : (
              <Icon color='yellow' loading name='setting' />
            )}
            {quality}
            <Label.Detail>{`${fileObj.percentCompleted}%`}</Label.Detail>
            {fileObj.startedAt && fileObj.completedAt ? (
              <Label.Detail>{`took ${timeConversion(
                fileObj.startedAt,
                fileObj.completedAt,
              )}`}</Label.Detail>
            ) : null}
          </Label>
        </div>
      );
    });
  };

  if (state.loading) {
    return (
      <div>
        <h1>loading</h1>
      </div>
    );
  } else {
    return (
      <Container>
        <h1>{state.video.title}</h1>
        <h3>{state.video._id}</h3>
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div>{renderFiles()}</div>
          <div>
            <Button id={state.video._id} type='primary' onClick={handleView}>
              View
            </Button>
            <Button id={state.video._id} type='danger' onClick={handleDelete}>
              Delete
            </Button>
          </div>
        </div>
      </Container>
    );
  }
});
