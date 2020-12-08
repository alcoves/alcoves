import React, { useRef, useState, useEffect, } from 'react';

import qs from 'query-string';
import styled from 'styled-components';
import { Spinner, } from 'evergreen-ui';

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
  height: calc(100vh - 300px);
  background-color: rgba(0,0,0,.3);
  max-height: calc((9 /  16) * 100vw);
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
  // https://cssgradient.io/
  background: rgb(255,255,255);
  transition: opacity .1s ease-in;
  -moz-transition: opacity .1s ease-in;
  -webkit-transition: opacity .1s ease-in;
  opacity: ${props => props.controlsVisible ? 1 : 0};
  background: linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0) 50%, rgba(0,0,0,0.30) 90%, rgba(0,0,0,0.60) 100%);
`;

const VideoWrapper = styled.video`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background: #000000;
`;

const UpperControls = styled.div`
  height: 100%;
  width: 100%;
`;

const LowerControls = styled.div`
  display: flex;
  overflow: none;
  flex-direction: row;
  width: calc(100% - 45px);
  justify-content: space-between;
`;

const LowerControlRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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
  const [loaded, setLoaded] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    const video = document.getElementById('bkenVideoPlayer');
    hls = new Hls({ startLevel: 3 });
    hls.loadSource(url);
    hls.attachMedia(video);
  }, []);

  function togglePlay() {
    if (vRef && vRef.current) {
      const r = vRef.current;
      r.paused ? r.play() : r.pause();
    }
  }

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
      onMouseMove={controlHover}
      onTouchStart={controlHover}
      onMouseEnter={() => setControlsVisible(true)}
      onMouseLeave={() => setControlsVisible(false)}
      style={{ cursor: controlsVisible ? 'auto' : 'none' }}
    >
      <VideoWrapper
        ref={vRef}
        id='bkenVideoPlayer'
        disableRemotePlayback
        onLoadedMetadata={onLoadedMetadata}
        onStalled={() => { setBuffering(true); }}
        onWaiting={() => { setBuffering(true); }}
        onPlaying={() => { setBuffering(false); }}
      />

      {buffering && (
        <BufferingWrapper>
          <Spinner size={64} />
        </BufferingWrapper>
      )}
 
      {hls && vRef && vRef.current && (
        <ControlsWrapper controlsVisible={controlsVisible}>
          <UpperControls onClick={togglePlay} />
          <LowerControls>
            <Scrubber vRef={vRef} />
          </LowerControls>
          <LowerControls style={{ marginBottom: '5px' }}>
            <LowerControlRow>
              <PlayButton vRef={vRef} />
              <VolumeButton vRef={vRef} />
              <VolumeSlider vRef={vRef} />
              <Duration vRef={vRef} />
            </LowerControlRow>
            <LowerControlRow>
              <QualitySelector hls={hls} />
              <PictureInPictureButton vRef={vRef} />
              <FullScreenButton vRef={vRef} />
            </LowerControlRow>
          </LowerControls>
        </ControlsWrapper>
      )}
    </Wrapper>
  );
}

export default VideoPlayer;
