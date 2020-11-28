import React from 'react';
import { Typography, } from '@material-ui/core';

export default function VideoStatus({ status }) {
  return (
    <Typography variant='subtitle1'>
      {`Status: ${status}`}
    </Typography>
  );
}
