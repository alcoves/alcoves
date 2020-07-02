import React from 'react';
import { Grid, LinearProgress } from '@material-ui/core';

function timeConversion(startTime, completeTime) {
  const millisec = new Date(completeTime).getTime() - new Date(startTime).getTime();
  const seconds = (millisec / 1000).toFixed(1);
  const minutes = (millisec / (1000 * 60)).toFixed(1);
  const hours = (millisec / (1000 * 60 * 60)).toFixed(1);
  const days = (millisec / (1000 * 60 * 60 * 24)).toFixed(1);

  if (seconds < 60) {
    return `${seconds} Sec`;
  }
  if (minutes < 60) {
    return `${minutes} Min`;
  }
  if (hours < 24) {
    return `${hours} Hrs`;
  }
  return `${days} Days`;
}

export default ({ versions }) => {
  return versions.map(({ status, preset, segments: { done, total } }) => {
    return (
      <div key={preset} style={{ margin: '5px 0px 5px 0px' }}>
        <Grid>
          <div style={{ margin: '0px 0px 5px 0px' }}>{preset}</div>
          <LinearProgress value={(done / total) * 100} variant='determinate' />
        </Grid>
      </div>
    );
  });
};
