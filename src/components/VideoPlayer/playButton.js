import React, { useEffect, useState, } from 'react';
import Icon from '../Icon';

function PlayButton({ vRef }) {
  const [paused, setPaused] = useState(vRef.current.paused);
  const iconName = paused ? 'play' : 'pause';

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
    <Icon
      width={20}
      height={20}
      stroke='#fff'
      name={iconName}
      onClick={handleClick}
      style={{ cursor: 'pointer', padding:'5px' }}
    />
  );
}

export default PlayButton;