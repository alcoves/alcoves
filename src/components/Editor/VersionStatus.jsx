import React from 'react';
import {
  Grid, LinearProgress, Paper, Typography,
} from '@material-ui/core';

export default ({ versions }) => (
  <Grid spacing={1} container>
    {versions.map(({ status, preset, percentCompleted }) => (
      <Grid xs={12} sm={6} item key={preset}>
        <Paper style={{ padding: '10px' }}>
          <Typography variant='subtitle1'>{preset}</Typography>
          <Typography variant='body1'>{status}</Typography>
        </Paper>
        <LinearProgress value={percentCompleted} variant='determinate' />
      </Grid>
    ))}
  </Grid>
);
