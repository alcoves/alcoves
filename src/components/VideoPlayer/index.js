import React, { useRef, useState, useEffect, } from 'react';
import qs from 'query-string';
import shaka from 'shaka-player';
import { Box, CircularProgress, Flex, } from '@chakra-ui/react';
import screenfull from 'screenfull';
import Scrubber from './scrubber';
import Duration from './duration';
import PlayButton from './playButton';
import VolumeSlider from './volumeSlider';
import VolumeButton from './volumeButton';
import QualitySelector from './qualitySelector';
import FullScreenButton from './fullScreenButton';
import PictureInPictureButton from './pictureInPictureButton';

let idleTimer;
let clickTimer;

function VideoPlayer({ thumbnail, url, id = 'bkenVideoPlayer' }) {
  const vRef = useRef(null);
  const cRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [controlsVisible, setControlsVisible] = useState(true);

  useEffect(() => {
    const video = document.getElementById(id);
    setPlayer(new shaka.Player(video));

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
      const { t = 0 } = qs.parse(window.location.search);
      // console.log(`Seeking to ${t}`);

      player.configure({
        manifest: {
          dash: {
            ignoreEmptyAdaptationSet: true,
          },
        },
      });

      player.load(url, t).then(() => {
        // console.debug('video has been loaded');
      }).catch((err) => {
        console.error(err);
      });
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

  function controlHover() {
    clearTimeout(idleTimer);
    if (!controlsVisible) setControlsVisible(true);

    idleTimer = setTimeout(() => {
      if (!vRef?.current?.paused) {
        setControlsVisible(player?.isBuffering());
      }
    }, 2000);
  }

  function renderCenter() {
    if (vRef.current.currentTime < 1) {
      return <PlayButton
        size='50px'
        vRef={vRef}
        color='#eee'
        chakraProps={{ variant: 'solid', rounded: 'xl', h:'100%', p:'10px' }}
      />;
    } if (player?.isBuffering()) {
      return <CircularProgress isIndeterminate />;
    }
    return <div/>;
  }

  function toggleFullScreen() {
    if (screenfull.isEnabled) {
      screenfull.toggle(cRef?.current);
    }
  }

  return (
    <Box
      ref={cRef}
      onMouseMove={controlHover}
      onTouchStart={controlHover}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => {
        if (!vRef?.current.paused) {
          setControlsVisible(player?.isBuffering());
        }
      }}
      m='0px' minW='100%' lineHeight='0px' minH='280px'
      pos='relative' backgroundColor='rgba(0,0,0,.3)'
      cursor={`${controlsVisible ? 'auto' : 'none'}`}
      height={`${rotation === 0 ? 'calc(100vh - 300px)' : 'calc(100vh - 48px)'}`}
      maxHeight={`${rotation === 0 ? 'calc((9 /  16) * 100vw)' : 'calc(100vh - 48px)'}`}
    >
      <video
        id={id}
        autoPlay
        ref={vRef}
        poster={thumbnail}
        disableRemotePlayback
        style={{ top: 0, left: 0, width: '100%', height: '100%', background: 'black' }}
      />

      {player && vRef?.current && (
        <Flex
          top='0' left='0' w='100%' h='100%'
          overflow='none' position='absolute' alignItems='center'
          flexDirection='column' justifyContent='flex-end'
          background='rgb(255,255,255)' transition='opacity .1s ease-in'
          opacity={`${controlsVisible ? 1 : 0}`}
          // eslint-disable-next-line
          background='linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.30) 90%, rgba(0,0,0,0.60) 100%)'
        >
          <Flex w='100%' h='100%' flexDirection='column' justify='center' align='center'
            onClick={(e) => {
              clearTimeout(clickTimer);
              if (e.detail === 1) {
                clickTimer = setTimeout(() => {
                  togglePlay();
                }, 200);
              } else if (e.detail === 2) {
                clearTimeout(clickTimer);
                toggleFullScreen();
              }
              e.preventDefault();
            }}
          >
            <Box> {renderCenter()} </Box>
          </Flex>
          <Flex w='100%' px='2' align='end'>
            <Scrubber vRef={vRef} />
          </Flex>
          <Flex w='100%' px='2' justifyContent='space-between' alignContent='end'>
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
                <FullScreenButton toggle={toggleFullScreen} />
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      )}
    </Box>
  );
}

export default VideoPlayer;