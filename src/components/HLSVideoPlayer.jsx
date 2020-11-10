import React, { useEffect, } from 'react';
import styled from 'styled-components';

const VideoPlayer = styled.video`
  margin: 0px;
  line-height: 0px;
  position: relative;
  height: calc(100vh - 300px);
  background-color: rgba(0,0,0,.3);
  max-height: calc((9 /  16) * 100vw);
`;

export default function HLSVideoPlayer({ link }) {
  useEffect(() => {
    const video = document.getElementById('video');
    const hls = new Hls();
    hls.loadSource(link);
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function() {
      video.play();
    });
  }, []);

  return <VideoPlayer id='video' controls />;
}