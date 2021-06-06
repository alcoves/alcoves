import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, } from '@chakra-ui/slider';
import React, { useEffect, useState, } from 'react';

function VolumeSlider({ vRef }) {
  const [volume, setVolume] = useState(vRef.current.volume * 100);

  useEffect(() => {
    const video = vRef.current;
    function handleVolume() { setVolume(video.volume * 100); }
    video.addEventListener('volumechange', handleVolume);
    return () => video.removeEventListener('volumechange', handleVolume);
  }, [vRef]);

  function handleChange(val) {
    const newVolume =  val / 100;
    vRef.current.volume = newVolume;
  }

  return (
    <Slider onChange={handleChange} 
      w='60px' color='white' lf='10px' aria-label='volume-slider'
      value={vRef.current.muted ? 0 : volume}
    >
      <SliderTrack>
        <SliderFilledTrack />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
}

export default VolumeSlider;