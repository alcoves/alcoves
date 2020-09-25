import qs from 'query-string';
import React, { useEffect, useRef, useState, } from 'react';
import { Fade, Menu, MenuItem, IconButton, Slider, LinearProgress, } from '@material-ui/core';
import { PauseOutlined, PlayArrowOutlined, VolumeUpOutlined, VolumeDownOutlined, VolumeOffOutlined, SettingsOutlined, FullscreenOutlined, PictureInPictureAltOutlined, } from '@material-ui/icons';

import styled from 'styled-components';
import Duration from './Duration';

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

const Controls = styled.div`
  width: 97%;
`;

const UpperControlsContainer = styled.div`
  height: 100%;
  width: 100%;
`;

const LowerControlsContainer = styled.div`
  display: flex;
  padding-bottom: 5px;
  flex-direction: row;
  justify-content: space-between;
`;

const LowerControlRow = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const VideoWrapper = styled.video`
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  position: absolute;
  background: #000000;
`;

function volumeIcon(v, muted) {
  if (muted) return <VolumeOffOutlined />;
  return v > .50 ? <VolumeUpOutlined /> : <VolumeDownOutlined />;
}

const pickUrl = (versions, override) => {
  if (versions) {
    const loadOrder = [
      'libvpx_vp9-2160p',
      'libx264-2160p',
      'libvpx_vp9-1440p',
      'libx264-1440p',
      'libvpx_vp9-1080p',
      'libx264-1080p',
      'libvpx_vp9-720p',
      'libx264-720p',
      'libvpx_vp9-480p',
      'libx264-480p',
    ];
    for (const desiredPreset of loadOrder) {
      for (const v of versions) {
        if (override && override === v.preset && v.link) return v;
        if (desiredPreset === v.preset && v.link) return v;
      }
    }
  }
};

let idleTimer = null;

function VideoPlayer({ versions }) {
  const vRef = useRef(null);
  const [volume, setVolume] = useState(.25);
  const [progress, setProgress] = useState(0);
  const [settingsEl, setSettingsEl] = useState(null);
  const [version, setVersion] = useState();
  const [controlsVisible, setControlsVisible] = useState(false);

  console.log('update');

  useEffect(() => {
    setVersion(pickUrl(versions));
  }, []);

  if (version) {
    return (
      <Wrapper
        style={{ cursor: controlsVisible ? 'auto' : 'none' }}
        onMouseMove={() => {
          clearTimeout(idleTimer);
          if (!controlsVisible) setControlsVisible(true);

          idleTimer = setTimeout(() => {
            if (!vRef?.current?.paused) {
              setSettingsEl(null);
              setControlsVisible(false);
            }
          }, 2000);
        }}
        onMouseEnter={() => setControlsVisible(true)}
        onMouseLeave={() => {
          if (!vRef?.current?.paused) {
            setControlsVisible(false);
          }
        }}
      >
        <VideoWrapper
          ref={vRef}
          src={version.link}
          id='bkenVideoPlayer'
          onPause={() => {
            setControlsVisible(true);
          }}
          onLoadedMetadata={() => {
            setVolume(vRef.current.volume * 100);

            const { t } = qs.parse(window.location.search);
            if (t) {
              vRef.current.currentTime = t;
              window.location.search = '';
            }
          }}
          onTimeUpdate={(e) => {
            const positionUpdate = (e.target.currentTime / e.target.duration) * 100;
            setProgress(positionUpdate);
          }}
          onClick={() => vRef.current.paused ? vRef.current.play() : vRef.current.pause()}
        />
        <Fade in timeout={250}>
          <ControlsWrapper style={{ visibility: controlsVisible ? 'visible' : 'hidden' }}>
            <UpperControlsContainer
              onClick={() => vRef.current.paused ? vRef.current.play() : vRef.current.pause()}
            />
            {controlsVisible && vRef && vRef.current && (
              <Controls>
                <Slider
                  style={{}}
                  onChange={(e, newValue) => {
                    const positionUpdate = (vRef.current.currentTime / vRef.current.duration) * 100;
                    setProgress(positionUpdate);
                    const seekPosition = vRef.current.duration * (newValue / 100);
                    vRef.current.currentTime = seekPosition;
                  }}
                  value={progress}
                />

                <LowerControlsContainer>
                  <LowerControlRow>
                    <IconButton
                      size='small'
                      onClick={() => vRef.current.paused ? vRef.current.play() : vRef.current.pause()}
                    >
                      {vRef.current.paused ? <PlayArrowOutlined /> : <PauseOutlined />}
                    </IconButton>

                    <IconButton
                      size='small'
                      onClick={() => {
                        if (vRef.current.muted) {
                          setVolume(.25 * 100);
                          vRef.current.volume = .25;
                          vRef.current.muted = false;
                        } else {
                          setVolume(0);
                          vRef.current.volume = 0;
                          vRef.current.muted = true;
                        }
                      }}
                    >
                      {volumeIcon(vRef.current.volume, vRef.current.muted)}
                    </IconButton>
                    <Slider
                      style={{ marginLeft: '10px', width: '60px', color: 'white' }}
                      onChange={(e, newValue) => {
                        if (newValue) {
                          setVolume(newValue);
                          vRef.current.muted = false;
                          vRef.current.volume = newValue / 100;
                        } else {
                          setVolume(0);
                          vRef.current.volume = 0;
                          vRef.current.muted = true;
                        }
                      }}
                      value={volume}
                    />
                    <Duration
                      duration={vRef?.current?.duration}
                      currentTime={vRef?.current?.currentTime}
                    />
                  </LowerControlRow>
                  <LowerControlRow>
                    <IconButton
                      size='small'
                      onClick={(e) => {
                        setSettingsEl(e.currentTarget);
                      }}
                    >
                      <SettingsOutlined />
                    </IconButton>
                    <Menu
                      keepMounted
                      id="version-selector"
                      anchorEl={settingsEl}
                      open={Boolean(settingsEl)}
                      onClose={() => {
                        setSettingsEl(null);
                      }}
                    >
                      {versions.filter(({ link }) => link).map((v) => (
                        <MenuItem
                          key={v.preset}
                          selected={v.link === vRef.current.src}
                          onClick={() => {
                            const {currentTime} = vRef.current;
                            vRef.current.src = v.link;
                            vRef.current.currentTime = currentTime;
                            vRef.current.play();
                            setSettingsEl(null);
                          }}
                        >
                          {v.preset.split('-')[1]}
                        </MenuItem>
                      ))}
                    </Menu>
                    <IconButton
                      size='small'
                      onClick={() => {
                        vRef.current.requestPictureInPicture();
                      }}
                    >
                      <PictureInPictureAltOutlined />
                    </IconButton>
                    <IconButton
                      size='small'
                      onClick={() => {
                        vRef.current.requestFullscreen();
                      }}
                    >
                      <FullscreenOutlined />
                    </IconButton>
                  </LowerControlRow>
                </LowerControlsContainer>
              </Controls>
            )}
          </ControlsWrapper>
        </Fade>
      </Wrapper>
    );
  } 
  return <LinearProgress />;
  
}

export default VideoPlayer;