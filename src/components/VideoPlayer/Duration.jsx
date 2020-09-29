import { Typography, } from '@material-ui/core';
import React, { useEffect, useState, } from 'react';
import videoDuration from '../../utils/videoDuration';

function Duration({ vRef = {} }) {
  const [time, setTime] = useState('0:00 / 0:00');

  function formatDuration() {
    return `${videoDuration(vRef.current.currentTime)} / ${videoDuration(vRef.current.duration)}`;
  }

  useEffect(() => {
    function timeUpdate() { setTime(formatDuration());}
    vRef.current.addEventListener('timeupdate', timeUpdate);
    return () => vRef.current.removeEventListener('timeupdate', timeUpdate);
  }, [vRef]);

  return (
    <Typography variant='subtitle1' style={{ marginLeft: '15px' }}>
      {time}
    </Typography>
  );
}

export default Duration;
