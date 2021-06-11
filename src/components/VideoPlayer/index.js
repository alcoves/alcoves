import React, { useRef, useState, useEffect, } from 'react';

import qs from 'query-string';

import { Box, CircularProgress, Flex, } from '@chakra-ui/react';
import Scrubber from './scrubber';
import Duration from './duration';
import PlayButton from './playButton';
import VolumeSlider from './volumeSlider';
import VolumeButton from './volumeButton';
import QualitySelector from './qualitySelector';
import FullScreenButton from './fullScreenButton';
import PictureInPictureButton from './pictureInPictureButton';

let player;
let idleTimer;

function VideoPlayer({ url }) {
  const vRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    const video = document.getElementById('bkenVideoPlayer');
    player = dashjs.MediaPlayer().create();

    player.updateSettings({
      streaming: {
        fastSwitchEnabled: true,
        lowLatencyEnabled: true,
        abr: {
          ABRStrategy: 'abrDynamic',
          autoSwitchBitrate: { video: true, audio: true },
        },
      },
    });
    player.initialize(video, url, true);

    const orientationchange = window.addEventListener('orientationchange', (event) => {
      setRotation(event.target.screen.orientation.angle);
      console.log(`the orientation of the device is now ${event.target.screen.orientation.angle}`);
    });
    return () => {
      window.removeEventListener('orientationchange', orientationchange);
    };
  }, []);

  function togglePlay() {
    if (vRef && vRef.current) {
      const r = vRef.current;
      r.paused ? r.play() : r.pause();
    }
  }

  useEffect(() => {
    function onKeydown(e) {
      if (e.code === 'Space') togglePlay();
    }
    window.addEventListener('keydown', onKeydown);
    return () => {
      window.removeEventListener('keydown', onKeydown);
    };
  });

  function onLoadedMetadata() {
    if (!loaded) {
      const { t } = qs.parse(window.location.search);
      if (t) vRef.current.currentTime = Number(t);
      const startPlayPromise = vRef.current.play();

      if (startPlayPromise !== undefined) {
        startPlayPromise.then(() => {
          console.info('video started playing without error');
          vRef.current.volume = 1; // TODO :: Set last know volume
          vRef.current.muted = false;
          setLoaded(true);
        }).catch(error => {
          console.error(error.name);
        });
      }      
    }
  }

  function controlHover() {
    clearTimeout(idleTimer);
    if (!controlsVisible) setControlsVisible(true);

    idleTimer = setTimeout(() => {
      if (!vRef?.current?.paused) {
        setControlsVisible(false);
      }
    }, 2000);
  }

  return (
    <Box
      onMouseMove={controlHover}
      onTouchStart={controlHover}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
      m='0px' minW='100%' lineHeight='0px' minH='280px'
      pos='relative' backgroundColor='rgba(0,0,0,.3)'
      cursor={`${controlsVisible ? 'auto' : 'none'}`}
      height={`${rotation === 0 ? 'calc(100vh - 300px)' : 'calc(100vh - 48px)'}`}
      maxHeight={`${rotation === 0 ? 'calc((9 /  16) * 100vw)' : 'calc(100vh - 48px)'}`}
    >
      <video
        muted
        autoPlay
        ref={vRef}
        id='bkenVideoPlayer'
        disableRemotePlayback
        onLoadedMetadata={onLoadedMetadata}
        onStalled={() => { setBuffering(true); }}
        onWaiting={() => { setBuffering(true); }}
        onPlaying={() => { setBuffering(false); }}
        style={{ top: 0, left: 0, width: '100%', height: '100%', background: 'black' }}
      />

      {player?.isReady() && vRef?.current && (
        <Flex
          top='0' left='0' w='100%' h='100%'
          overflow='none' position='absolute' alignItems='center'
          flexDirection='column' justifyContent='flex-end'
          background='rgb(255,255,255)' transition='opacity .1s ease-in'
          opacity={`${controlsVisible ? 1 : 0}`}
          background='linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.30) 90%, rgba(0,0,0,0.60) 100%)'
        >
          
          <Flex pt='10' w='100%' h='100%' onClick={() => togglePlay()}>
            {buffering &&<CircularProgress isIndeterminate />}
          </Flex>
          <Flex w='100%' px='2' h='6' justifyContent='space-between'>
            <Scrubber vRef={vRef} />
          </Flex>
          <Flex w='100%' px='2' h='6' mb='2' justifyContent='space-between' alignContent='end'>
            <Flex alignItems='center'>
              <PlayButton vRef={vRef} />
              <VolumeButton vRef={vRef} />
              <VolumeSlider vRef={vRef} />
              <Duration vRef={vRef} />
            </Flex>
            <Flex alignItems='center'>
              <QualitySelector player={player} />
              <Flex alignItems='center'>
                <PictureInPictureButton vRef={vRef} />
                <FullScreenButton vRef={vRef} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}

export default VideoPlayer;