import React, { useRef, useState, useEffect, } from 'react';

import qs from 'query-string';
import styled from 'styled-components';
import Spinner from '../Spinner';

import Scrubber from './scrubber';
import Duration from './duration';
import PlayButton from './playButton';
import VolumeSlider from './volumeSlider';
import VolumeButton from './volumeButton';
import QualitySelector from './qualitySelector';
import FullScreenButton from './fullScreenButton';
import PictureInPictureButton from './pictureInPictureButton';

const Wrapper = styled.div`
  margin: 0px;
  line-height: 0px;
  position: relative;
  background-color: rgba(0,0,0,.3);
   ${p => p.rotation === 0 ? 
    'max-height: calc((9 /  16) * 100vw); height: calc(100vh - 300px);'
    : 
    'max-height: calc(100vh - 48px); height: calc(100vh - 48px);'
}
`;

const ControlsWrapper = styled.div`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  overflow: none;
  position: absolute;
  align-items: center;
  flex-direction: column;
  justify-content: flex-end;
  background: rgb(255,255,255);
  transition: opacity .1s ease-in;
  -moz-transition: opacity .1s ease-in;
  -webkit-transition: opacity .1s ease-in;
  opacity: ${props => props.controlsVisible ? 1 : 0};
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.30) 90%, rgba(0,0,0,0.60) 100%);
`;

const BufferingWrapper = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`;

let hls;
let idleTimer;

function VideoPlayer({ url }) {
  const vRef = useRef(null);
  const [rotation, setRotation] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    const video = document.getElementById('bkenVideoPlayer');
    hls = new Hls({ startLevel: 3 });
    hls.loadSource(url);
    hls.attachMedia(video);

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
      vRef.current.play();
      setLoaded(true);
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
    <Wrapper
      rotation={rotation}
      onMouseMove={controlHover}
      onTouchStart={controlHover}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
      style={{ cursor: controlsVisible ? 'auto' : 'none' }}
    >
      <video
        ref={vRef}
        id='bkenVideoPlayer'
        disableRemotePlayback
        onLoadedMetadata={onLoadedMetadata}
        onStalled={() => { setBuffering(true); }}
        onWaiting={() => { setBuffering(true); }}
        onPlaying={() => { setBuffering(false); }}
        className='-top-0 -left-0 w-full h-full absolute bg-black'
      />

      {buffering && (
        <BufferingWrapper>
          <Spinner />
        </BufferingWrapper>
      )}
 
      {hls && vRef && vRef.current && (
        <ControlsWrapper controlsVisible={controlsVisible}>
          <div className='h-full w-full' />
          <div className='flex flex-row w-full px-2 h-6 justify-between'>
            <Scrubber vRef={vRef} />
          </div>
          <div className='flex flex-row w-full px-2 h-6 mb-1 justify-between content-end'>
            <div className='flex flex-row items-center'>
              <PlayButton vRef={vRef} />
              <VolumeButton vRef={vRef} />
              <VolumeSlider vRef={vRef} />
              <Duration vRef={vRef} />
            </div>
            <div className='flex flex-row items-center'>
              <QualitySelector hls={hls} />
              <div className='flex flex-row items-center'>
                <PictureInPictureButton vRef={vRef} />
                <FullScreenButton vRef={vRef} />
              </div>
            </div>
          </div>
        </ControlsWrapper>
      )}
    </Wrapper>
  );
}

export default VideoPlayer;