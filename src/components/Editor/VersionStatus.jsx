import React from 'react';
import styled from 'styled-components';
import { CircularProgress, Grid, Paper, Typography, } from '@material-ui/core';

const VersionStatusBox = styled.div`
  margin: 0px 4px 0px 4px;
`;

function VersionStatus({ versions }) {
  return (
    <Grid spacing={1} container>
      {versions.map(({ status, preset, percentCompleted }) => (
        <Grid xs={12} sm={6} md={3} item key={preset}>
          <Paper style={{ padding: '10px', display: 'flex' }}>
            <VersionStatusBox>
              <CircularProgress variant='static' value={percentCompleted} />
            </VersionStatusBox>
            <VersionStatusBox>
              <Typography variant='subtitle1'>{preset}</Typography>
              <Typography variant='subtitle2'>{status}</Typography>
            </VersionStatusBox>
          </Paper>
        </Grid>
      ))}
    </Grid>
  );
}

export default VersionStatus;
