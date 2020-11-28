import { IconButton, } from '@material-ui/core';
import React, { useEffect, useState, } from 'react';
import { VolumeOffOutlined, VolumeUpOutlined, VolumeDownOutlined, } from '@material-ui/icons';

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

  function volumeIcon() {
    if (!volume) return <VolumeOffOutlined />;
    if (volume < .50) return <VolumeDownOutlined />;
    return <VolumeUpOutlined />;
  }

  return (
    <IconButton size='small' onClick={handleClick}>
      {volumeIcon()}
    </IconButton>
  );
}

export default VolumeButton;