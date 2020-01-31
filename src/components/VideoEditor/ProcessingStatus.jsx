import React from 'react';

import { observer, useObservable } from 'mobx-react-lite';
import { Label, Icon, Loader } from 'semantic-ui-react';
import useInterval from '../../lib/useInterval';

function timeConversion(startTime, completeTime) {
  const millisec = new Date(completeTime).getTime() - new Date(startTime).getTime();
  const seconds = (millisec / 1000).toFixed(1);
  const minutes = (millisec / (1000 * 60)).toFixed(1);
  const hours = (millisec / (1000 * 60 * 60)).toFixed(1);
  const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) {
    return `${seconds  } Sec`;
  } if (minutes < 60) {
    return `${minutes  } Min`;
  } if (hours < 24) {
    return `${hours  } Hrs`;
  } 
    return `${days  } Days`;
  
}

export default observer(props => {
  const state = useObservable({
    video: {},
    queryLoading: true,
  });

  const handleRefresh = async () => {
    try {
      const { data } = await api({
        method: 'get',
        url: `/videos/${props.videoId}`,
      });

      state.video = data.payload;
      state.queryLoading = false;
    } catch (error) {
      console.error(error);
      state.queryLoading = false;
    }
  };

  if (state.queryLoading === true) {
    handleRefresh();
  }

  useInterval(() => {
    if (state.video.status !== 'completed') {
      handleRefresh();
    }
  }, 3000);

  const renderFiles = () => {
    if (state.video.files) {
      return Object.entries(state.video.files).map(([quality, fileObj]) => {
        return (
          <div key={quality} style={{ margin: '5px 0px 5px 0px' }}>
            <Label as='a' color='grey'>
              {fileObj.status === 'completed' ? (
                <Icon color='green' name='check circle outline' />
              ) : (
                <Icon color='yellow' name='setting' />
              )}
              {quality}
              <Label.Detail>{`${fileObj.percentCompleted}%`}</Label.Detail>
              {fileObj.conversionStartTime && fileObj.conversionCompleteTime ? (
                <Label.Detail>
                  {`took ${timeConversion(
                  fileObj.conversionStartTime,
                  fileObj.conversionCompleteTime,
                )}`}
                </Label.Detail>
              ) : null}
            </Label>
          </div>
        );
      });
    }
  };

  if (state.queryLoading) {
    return <Loader active inline='centered' style={{ marginTop: '30px' }} />;
  } 
    return <div>{renderFiles()}</div>;
  
});
