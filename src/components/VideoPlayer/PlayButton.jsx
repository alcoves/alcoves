import { IconButton, } from '@material-ui/core';
import React, { useEffect, useState, } from 'react';
import { PlayArrowOutlined, PauseOutlined, } from '@material-ui/icons';

function PlayButton({ vRef }) {
  const [paused, setPaused] = useState(vRef.current.paused);

  useEffect(() => {
    function handlePlay() {
      setPaused(vRef.current.paused);
    }

    vRef.current.addEventListener('play', handlePlay);
    vRef.current.addEventListener('pause', handlePlay);

    return () => {
      vRef.current.removeEventListener('play', handlePlay);
      vRef.current.removeEventListener('pause', handlePlay);
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