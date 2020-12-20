import React, { useEffect, useState, } from 'react';
import Icon from '../Icon';

function VolumeButton({ vRef }) {
  const [volume, setVolume] = useState(vRef.current.volume);

  useEffect(() => {
    const video = vRef.current;
    function handleVolume() { setVolume(video.volume); }
    video.addEventListener('volumechange', handleVolume);
    return () => video.removeEventListener('volumechange', handleVolume);
  }, [vRef]);

  function handleClick() {
    vRef.current.volume? vRef.current.volume = 0 : vRef.current.volume = .5;
  }

  function volumeIconName() {
    if (!volume) return 'volume-x';
    if (volume < .60) return 'volume-1';
    if (volume < .30) return 'volume';
    return 'volume-2';
  }

  return (
    <Icon
      width={20}
      height={20}
      stroke='#fff'
      onClick={handleClick}
      name={volumeIconName()}
      style={{ cursor: 'pointer', padding:'5px' }}
    />
  );
}

export default VolumeButton;