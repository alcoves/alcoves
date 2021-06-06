import { Box, } from '@chakra-ui/react';
import React, { useEffect, useState, } from 'react';
import { IoVolumeHighOutline, IoVolumeLowOutline, IoVolumeMediumOutline, IoVolumeMuteOutline, } from 'react-icons/io5';

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

  function renderVolumeIcon() {
    if (!volume || vRef.current.muted) {
      return (
        <IoVolumeMuteOutline
          size='1.3rem'
          stroke='white'
          cursor='pointer'
          onClick={handleClick}
        />
      );
    }
    
    if (volume < .30) {
      return (
        <IoVolumeLowOutline
          size='1.3rem'
          stroke='white'
          cursor='pointer'
          onClick={handleClick}
        />
      );
    }
    
    if (volume < .60) {
      return (
        <IoVolumeMediumOutline
          size='1.3rem'
          stroke='white'
          cursor='pointer'
          onClick={handleClick}
        />
      );
    }

    return (
      <IoVolumeHighOutline
        size='1.3rem'
        stroke='white'
        cursor='pointer'
        onClick={handleClick}
      />
    );
  }

  return (
    <Box mx='2'>
      {renderVolumeIcon()}
    </Box>
  );
}

export default VolumeButton;