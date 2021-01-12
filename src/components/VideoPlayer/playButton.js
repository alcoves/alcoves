import React, { useEffect, useState, } from 'react';

function PlayButton({ vRef }) {
  const [paused, setPaused] = useState(vRef.current.paused);

  function iconPaths () {
    if (paused) {
      return (
        <>
          <path 
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z'
          />
          <path
            strokeLinecap='round'
            strokeLinejoin='round'
            strokeWidth={2}
            d='M21 12a9 9 0 11-18 0 9 9 0 0118 0z'
          />
        </>
      );  
    }

    return(
      <path
        strokeWidth={2}
        strokeLinecap='round'
        strokeLinejoin='round'
        d='M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z'
      />
    );
  }

  useEffect(() => {
    const video = vRef.current;
    function handlePlay() {
      setPaused(video.paused);
    }

    video.addEventListener('play', handlePlay);
    video.addEventListener('pause', handlePlay);
    return () => {
      video.removeEventListener('play', handlePlay);
      video.removeEventListener('pause', handlePlay);
    };
  }, [vRef]);

  function handleClick() {
    vRef.current.paused ? vRef.current.play() : vRef.current.pause();
  }

  return (
    <svg 
      className='h-6 w-6 mr-2 cursor-pointer'
      onClick={handleClick}
      viewBox='0 0 24 24'
      xmlns='http://www.w3.org/2000/svg'
      fill='none'
      stroke='white'
    >
      {iconPaths()}
    </svg>
  );
}

export default PlayButton;