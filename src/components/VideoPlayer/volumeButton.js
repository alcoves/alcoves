import React, { useEffect, useState, } from 'react';

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

  function volumeIcon() {
    if (!volume) {
      return (
        <>
          <path 
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
            clipRule='evenodd'
          />
          <path 
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2'
          />
        </>
      );
    } 
    return (
      <path 
        strokeLinecap='round'
        strokeLinejoin='round'
        strokeWidth={2}
        d='M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z'
      />
    ); 
  }

  return (

    <svg
      className='h-6 w-6 cursor-pointer'
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      stroke='white'
      onClick={handleClick}
    >
      {volumeIcon()}
    </svg>
  );
}

export default VolumeButton;