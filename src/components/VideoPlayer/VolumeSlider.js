import { Box, Slider, SliderFilledTrack, SliderThumb, SliderTrack } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'

function VolumeSlider({ vRef }) {
  const [volume, setVolume] = useState(vRef.current.volume * 100)

  useEffect(() => {
    const video = vRef.current
    function handleVolume() {
      setVolume(video.volume * 100)
    }
    video.addEventListener('volumechange', handleVolume)
    return () => video.removeEventListener('volumechange', handleVolume)
  }, [vRef])

  function handleChange(val) {
    const newVolume = val / 100
    if (newVolume > 0) vRef.current.muted = false
    vRef.current.volume = newVolume
  }

  return (
    <Box mx='2'>
      <Slider
        onChange={handleChange}
        w='60px'
        color='white'
        lf='10px'
        aria-label='volume-slider'
        value={vRef.current.muted ? 0 : volume}>
        <SliderTrack bg='rgba(120, 120, 120, 1)'>
          <SliderFilledTrack bg='#bf1e2e' />
        </SliderTrack>
        <SliderThumb bg='#bf1e2e' />
      </Slider>
    </Box>
  )
}

export default VolumeSlider
