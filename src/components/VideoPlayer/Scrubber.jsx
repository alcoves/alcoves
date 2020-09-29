import { Slider, } from '@material-ui/core';
import React, { useEffect, useState, } from 'react';

function Duration({ vRef = {} }) {
  const [progress, setProgress] = useState(vRef.current.currentTime / vRef.current.duration * 100);

  useEffect(() => {
    function timeUpdate() { 
      const positionUpdate = (vRef.current.currentTime / vRef.current.duration) * 100;
      setProgress(positionUpdate);
    }
    vRef.current.addEventListener('timeupdate', timeUpdate);
    return () => vRef.current.removeEventListener('timeupdate', timeUpdate);
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
