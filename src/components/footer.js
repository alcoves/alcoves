import React from 'react';
import { Grid, Typography, } from '@material-ui/core';

export default function Footer() {
  const gitSha = process.env.REACT_APP_GIT_SHA;
  return (
    <Grid style={{ height: '50px' }} container direction='row' justify='center' alignItems='center'>
      <Grid item>
        <Typography variant='subtitle2'>
          <a href={`https://github.com/bken-io/web/commit/${gitSha}`}>
            Version:
            {gitSha}
          </a>
        </Typography>
      </Grid>
    </Grid>
  );
}
