import React from 'react';
import { Grid, LinearProgress, Paper, Typography } from '@material-ui/core';

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
  return (
    <Grid spacing={1} container>
      {versions.map(({ status, preset, percentCompleted }) => {
        return (
          <Grid xs={12} sm={6} item key={preset}>
            <Paper style={{ padding: '10px' }}>
              <Typography variant='subtitle1'>{preset}</Typography>
              <Typography variant='body2'>{status}</Typography>
            </Paper>
            <LinearProgress value={percentCompleted} variant='determinate' />
          </Grid>
        );
      })}
    </Grid>
  );
};
