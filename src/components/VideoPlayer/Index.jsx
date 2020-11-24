import React, { useRef, useState, useEffect, } from 'react';

import qs from 'query-string';
import styled from 'styled-components';
import { CircularProgress, Fade, } from '@material-ui/core';

import Scrubber from './Scrubber';
import Duration from './Duration';
import PlayButton from './PlayButton';
import VolumeSlider from './VolumeSlider';
import VolumeButton from './VolumeButton';
import QualitySelector from './QualitySelector';
import FullScreenButton from './FullScreenButton';
import PictureInPictureButton from './PictureInPictureButton';

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
  padding-bottom: 5px;
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

function VideoPlayer({ link }) {
  const vRef = useRef(null);
  const [loaded, setLoaded] = useState(false);
  const [buffering, setBuffering] = useState(true);
  const [controlsVisible, setControlsVisible] = useState(false);

  useEffect(() => {
    const video = document.getElementById('bkenVideoPlayer');
    hls = new Hls({ startLevel: 3 });
    hls.loadSource(link);
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
          <CircularProgress size={60} thickeness={6} />
        </BufferingWrapper>
      )}
 
      {hls && vRef && vRef.current && (
        <Fade in={controlsVisible}>
          <ControlsWrapper controlsVisible={controlsVisible}>
            <UpperControls onClick={togglePlay} />
            <LowerControls>
              <Scrubber vRef={vRef} />
            </LowerControls>
            <LowerControls>
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
        </Fade>
      )}
    </Wrapper>
  );
}

export default VideoPlayer;
