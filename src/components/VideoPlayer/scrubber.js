import React, { useEffect, useState, } from 'react';
import { Slider, SliderFilledTrack, SliderThumb, SliderTrack, Flex, Box, } from '@chakra-ui/react';

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
    <Box w='100%' position='relative'>
      <Slider
        zIndex='2'
        id='current'
        cursor='pointer'
        focusThumbOnChange={false}
        onChange={(val) => {
          setProgress(val);
          vRef.current.currentTime = val;
        }} 
        max={vRef?.current?.duration || 100}
        value={progress || 0}
        aria-label='current'
      >
        <SliderTrack bg='transparent'>
          <SliderFilledTrack bg='#bf1e2e' />
        </SliderTrack>
        <SliderThumb bg='#bf1e2e'/>
      </Slider>
      <Box position='absolute' w='100%' top='1'>
        <Slider
          height='6px'
          id='buffer'
          aria-label='buffered'
          value={bufferedEnd}
          max={vRef?.current?.duration || 100}
        >
          <SliderTrack rounded='md' bg='rgba(255, 255, 255, 0.2)'>
            <SliderFilledTrack bg='rgba(190, 190, 190, 1)' rounded='md' />
          </SliderTrack>
        </Slider>
      </Box>
    </Box>
  );
}

export default Duration;
