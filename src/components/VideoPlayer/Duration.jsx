import { Typography, } from '@material-ui/core';
import React from 'react';
import videoDuration from '../../utils/videoDuration';

function Duration({ currentTime = '', duration = '' }) {
  return (
    <Typography variant='subtitle1' style={{ marginLeft: '15px' }}>
      {`${videoDuration(currentTime)} / ${videoDuration(duration)}`}
    </Typography>
  );
}

export default Duration;