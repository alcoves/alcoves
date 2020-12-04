import React, { useEffect, useState, } from 'react';
import { IconButton, } from '@material-ui/core';
import { PlayArrowOutlined, PauseOutlined, } from '@material-ui/icons';

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
    <IconButton size='small' onClick={handleClick}>
      {paused ? <PlayArrowOutlined /> : <PauseOutlined />}
    </IconButton>
  );
}

export default PlayButton;