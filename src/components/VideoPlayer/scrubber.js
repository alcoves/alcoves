import React, { useEffect, useState, } from 'react';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, } from '@chakra-ui/slider';

function Duration({ vRef = {} }) {
  const [progress, setProgress ] = useState(0);

  useEffect(() => {
    if (vRef.current.currentTime) {
      if (Number.isNaN(vRef.current.currentTime)) {
        setProgress(0);
      } else {
        setProgress(vRef.current.currentTime);
      }
    }
  }, []);

  useEffect(() => {
    function timeUpdate() {
      if (vRef?.current?.currentTime) {
        setProgress(vRef.current.currentTime);
      }
    }

    vRef.current.addEventListener('timeupdate', timeUpdate);
    return () => {
      if (vRef?.current) {
        vRef.current.removeEventListener('timeupdate', timeUpdate);
      }
    };
  }, [vRef]);

  return (
    <Slider 
      onChange={(val) => {
        setProgress(val);
        vRef.current.currentTime = val;
      }} 
      max={vRef.current.duration || 0}
      w='100%' color='white' lf='10px' aria-label='volume-slider'
      value={progress}
    >
      <SliderTrack bg='gray.700'>
        <SliderFilledTrack bg='gray.500' />
      </SliderTrack>
      <SliderThumb />
    </Slider>
  );
}

export default Duration;
