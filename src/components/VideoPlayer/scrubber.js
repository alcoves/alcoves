import React, { useEffect, useState, } from 'react';

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
    <input
      min={0}
      type='range'
      value={progress}
      className='outline-none'
      max={vRef.current.duration || 0}
      onChange={({ target }) => {
        setProgress(target.value);
      }}
    />
  );
}

export default Duration;
