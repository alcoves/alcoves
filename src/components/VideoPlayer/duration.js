import React, { useEffect, useState, } from 'react';
import { Heading, } from 'evergreen-ui';
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
    <Heading size={400} color='white' marginLeft={15}>
      {time}
    </Heading>
  );
}

export default Duration;
