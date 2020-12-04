import React, { useEffect, useState, } from 'react';
import { Typography, } from '../old/node_modules/@material-ui/core';
import videoDuration from '../../utils/videoDuration';

function Duration({ vRef }) {
  const [time, setTime] = useState('0:00 / 0:00');

  function formatDuration() {
    return `${videoDuration(vRef.current.currentTime)} / ${videoDuration(vRef.current.duration)}`;
  }

  useEffect(() => {
    const video = vRef.current;
    function timeUpdate() { setTime(formatDuration());}
    video.addEventListener('timeupdate', timeUpdate);
    return () => video.removeEventListener('timeupdate', timeUpdate);
  }, [vRef]);

  return (
    <Typography variant='subtitle1' style={{ marginLeft: '15px' }}>
      {time}
    </Typography>
  );
}

export default Duration;
