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

let idleTimer;

const defaultOpts = {
  vod: {
    streaming: {
      fastSwitchEnabled: true,
      abr: {
        ABRStrategy: 'abrDynamic',
        autoSwitchBitrate: { video: true, audio: true },
      },
    },
  },
  live: {
    streaming: {
      liveDelay: 2,
      liveCatchup: {
        minDrift: 0.05,
        playbackRate: 0.3,
        playbackBufferMin: 0.5,    
      },
      fastSwitchEnabled: true,
      lowLatencyEnabled: true,
      abr: {
        ABRStrategy: 'abrDynamic',
        autoSwitchBitrate: { video: true, audio: true },
      },
    },
  },
};

function VideoPlayer({ url, id = 'bkenVideoPlayer', mode = 'vod' }) {
  const vRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [buffering, setBuffering] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    setPlayer(dashjs.MediaPlayer().create());
    console.log('here', url);
    const orientationchange = window.addEventListener('orientationchange', (event) => {
      setRotation(event.target.screen.orientation.angle);
      console.log(`the orientation of the device is now ${event.target.screen.orientation.angle}`);
    });
    return () => {
      window.removeEventListener('orientationchange', orientationchange);
    };
  }, []);

  useEffect(() => {
    if (player) {
      const video = document.getElementById(id);
      player.updateSettings(defaultOpts[mode]);
  
      player.on(dashjs.MediaPlayer.events.PLAYBACK_NOT_ALLOWED, () => {
        console.log('Playback did not start due to auto play restrictions. Muting audio and reloading');
        video.muted = true;
        player.initialize(video, url, true);
      });
  
      player.initialize(video, url, true);
    }
  }, [player]);

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
    return () => window.removeEventListener('keydown', onKeydown);
  });

  useEffect(() => {
    if (buffering) {
      setControlsVisible(true);
    }
  }, [buffering]);

  function controlHover() {
    clearTimeout(idleTimer);
    if (!controlsVisible) setControlsVisible(true);

    idleTimer = setTimeout(() => {
      if (!vRef?.current?.paused) {
        setControlsVisible(buffering);
      }
    }, 2000);
  }

  return (
    <Box
      onMouseMove={controlHover}
      onTouchStart={controlHover}
      onMouseEnter={() => setControlsVisible(!buffering)}
      onMouseLeave={() => setControlsVisible(buffering)}
      m='0px' minW='100%' lineHeight='0px' minH='280px'
      pos='relative' backgroundColor='rgba(0,0,0,.3)'
      cursor={`${controlsVisible ? 'auto' : 'none'}`}
      height={`${rotation === 0 ? 'calc(100vh - 300px)' : 'calc(100vh - 48px)'}`}
      maxHeight={`${rotation === 0 ? 'calc((9 /  16) * 100vw)' : 'calc(100vh - 48px)'}`}
    >
      <video
        muted
        autoPlay
        id={id}
        ref={vRef}
        disableRemotePlayback
        onLoadedMetadata={() => {
          if (player.isReady()) {
            const { t } = qs.parse(window.location.search);
            if (t) vRef.current.currentTime = Number(t);
          }
        }}
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
          <Flex w='100%' h='100%' justify='center' align='center' onClick={() => togglePlay()}>
            <Box w='30px' h='30px'>
              {buffering && <CircularProgress isIndeterminate />}
            </Box>
          </Flex>
          <Flex w='100%' px='2' h='6' justifyContent='space-between'>
            {Number.isFinite(vRef?.current?.duration) && <Scrubber vRef={vRef} />}
          </Flex>
          <Flex w='100%' px='2' h='6' mb='2' justifyContent='space-between' alignContent='end'>
            <Flex alignItems='center'>
              <PlayButton vRef={vRef} />
              <VolumeButton vRef={vRef} />
              <VolumeSlider vRef={vRef} />
              <Duration player={player} vRef={vRef} />
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