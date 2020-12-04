import React, { useEffect, useState, } from 'react';
import { Slider, } from '../old/node_modules/@material-ui/core';

function Duration({ vRef = {} }) {
  const [progress, setProgress] = useState(vRef.current.currentTime / vRef.current.duration * 100);

  useEffect(() => {
    const video = vRef.current;
    function timeUpdate() { 
      const positionUpdate = (video.currentTime / video.duration) * 100;
      setProgress(positionUpdate);
    }
    video.addEventListener('timeupdate', timeUpdate);
    return () => video.removeEventListener('timeupdate', timeUpdate);
  }, [vRef]);

  function handleChange(e, newValue) {
    const positionUpdate = (vRef.current.currentTime / vRef.current.duration) * 100;
    setProgress(positionUpdate);
    const seekPosition = vRef.current.duration * (newValue / 100);
    vRef.current.currentTime = seekPosition;
  }

  return (
    <Slider
      value={progress}
      onChange={handleChange}
    />
  );
}

export default Duration;
