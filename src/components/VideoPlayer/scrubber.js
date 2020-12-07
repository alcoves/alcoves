import React, { useEffect, useState, } from 'react';
import styled from 'styled-components';

const Slider = styled.input`
  width: 100%;
  height: 10px;
  outline: none;
  border: solid red 1px;
`;

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

  function handleChange({ target }) {
    const positionUpdate = (vRef.current.currentTime / vRef.current.duration) * 100;
    setProgress(positionUpdate);
    const seekPosition = vRef.current.duration * (target.value / 100);
    console.log({ seekPosition });
    vRef.current.currentTime = seekPosition;
  }

  return (
    <Slider
      id='vol'
      min='0'
      max='100'
      type='range'
      name='volume'
      value={progress}
      onChange={handleChange}
      style={{ color: 'white' }}
    />
  );
}

export default Duration;
