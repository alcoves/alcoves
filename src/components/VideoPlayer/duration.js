import { Text, } from '@chakra-ui/layout';
import React, { useEffect, useState, } from 'react';
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
    <Text ml='4' select='none' color='lightgrey' fontSize='.8rem' fontWeight='800'>
      {time}
    </Text>
  );
}

export default Duration;
