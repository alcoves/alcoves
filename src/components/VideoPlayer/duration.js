import { Text, Flex, } from '@chakra-ui/react';
import React, { useEffect, useState, } from 'react';
import videoDuration from '../../utils/videoDuration';

function Duration({ vRef, player = {} }) {
  const [time, setTime] = useState('0:00 / 0:00');

  function formatDuration() {
    if (Number.isFinite(vRef.current.duration)) {
      return `${videoDuration(vRef.current.currentTime)} / ${videoDuration(vRef.current.duration)}`;
    }

    return (
      <Flex>
        <Text >
          {videoDuration(vRef.current.currentTime)}
        </Text>
        <Text cursor='pointer' onClick={() => player.seek(player.duration())}
          ml='2' textTransform='uppercase' color='red.500' fontSize='.8rem' fontWeight='800'>
          Live
        </Text>
      </Flex>
    );
  }

  useEffect(() => {
    const video = vRef.current;
    function timeUpdate() { setTime(formatDuration());}
    video.addEventListener('timeupdate', timeUpdate);
    return () => video.removeEventListener('timeupdate', timeUpdate);
  }, [vRef]);

  return (
    <Flex ml='4' select='none' color='lightgrey' fontSize='.8rem' fontWeight='800'>
      <Text>{time}</Text>
    </Flex>
  );
}

export default Duration;
