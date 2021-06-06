import { Box, } from '@chakra-ui/react';
import React, { useEffect, useState, } from 'react';
import { IoPauseOutline, IoPlayOutline, } from 'react-icons/io5';

function PlayButton({ vRef }) {
  const [paused, setPaused] = useState(vRef.current.paused);

  useEffect(() => {
    const video = vRef.current;
    function handlePlay() {
      setPaused(video.paused);
    }

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePlay);
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePlay);
    };
  }, [vRef]);

  function handleClick() {
    vRef.current.paused ? vRef.current.play() : vRef.current.pause();
  }

  return (
    <Box mr='2'>
      {paused ? <IoPlayOutline
        size='1.3rem'
        stroke='white'
        cursor='pointer'
        onClick={handleClick}
      /> : <IoPauseOutline
        size='1.3rem'
        stroke='white'
        cursor='pointer'
        onClick={handleClick}
      />
      }
    </Box>
  );
}

export default PlayButton;