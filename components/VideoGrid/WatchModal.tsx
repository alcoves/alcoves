import React from 'react'
import VideoJS from './VideoJS' // point to where the functional component is stored

export default function WatchModal(): JSX.Element {
  const playerRef = React.useRef(null)

  const videoJsOptions = {
    fluid: true,
    autoplay: true,
    controls: true,
    responsive: true,
    sources: [
      {
        src: 'https://cdn.bken.io/v/61515dd1f1f1d2abf155cfe9/61515dd1f1f1d2abf155cfed/stream.m3u8',
        type: 'application/x-mpegURL',
      },
    ],
  }

  const handlePlayerReady = (player: string) => {
    playerRef.current = player

    // you can handle player events here
    player.on('waiting', () => {
      console.log('player is waiting')
    })

    player.on('dispose', () => {
      console.log('player will dispose')
    })
  }

  // const changePlayerOptions = () => {
  //   // you can update the player through the Video.js player instance
  //   if (!playerRef.current) {
  //     return;
  //   }
  //   // [update player through instance's api]
  //   playerRef.current.src([{src: 'http://ex.com/video.mp4', type: 'video/mp4'}]);
  //   playerRef.current.autoplay(false);
  // };

  return (
    <>
      <VideoJS options={videoJsOptions} onReady={handlePlayerReady} />
    </>
  )
}
