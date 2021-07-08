import React, { useEffect, useState, } from 'react';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, } from '@chakra-ui/react';

function Duration({ vRef = {} }) {
  const bufferedLength = vRef?.current?.buffered?.length;
  const bufferedEnd = bufferedLength ? vRef?.current?.buffered?.end(bufferedLength - 1) : 0;
  // const bufferedStart = bufferedLength ? vRef?.current?.buffered?.start(0) : 0;

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
        setProgress(vRef?.current?.currentTime);
      }
    }

    vRef?.current.addEventListener('timeupdate', timeUpdate);
    return () => {
      if (vRef?.current) {
        vRef?.current?.removeEventListener('timeupdate', timeUpdate);
      }
    };
  }, [vRef]);

  return (
    <Slider
      w='100%'
      cursor='pointer'
      focusThumbOnChange={false}
      onChange={(val) => {
        setProgress(val);
        vRef.current.currentTime = val;
      }} 
      max={vRef?.current?.duration || 0}
      value={progress}
    >

      <Slider
        w='100%'
        h='5px' // important to align button
        max={vRef?.current?.duration || 0}
        lf='10px' aria-label='buffered'
        value={bufferedEnd || progress}
      >
        <SliderTrack rounded='md' bg='rgba(160, 174, 192, .25)'>
          <SliderFilledTrack bg='gray.500' rounded='md' />
        </SliderTrack>
      </Slider>
      
      <SliderTrack bg='transparent'>
        <SliderFilledTrack bg='transparent' />
      </SliderTrack>
      <SliderThumb mr='2' h='16px' w='16px' bg='gray.500'/>
    </Slider>
  );
}

export default Duration;
