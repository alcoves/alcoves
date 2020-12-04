import React from 'react';
import { IconButton, } from '@material-ui/core';
import { FullscreenOutlined, } from '@material-ui/icons';

function FullScreenButton({ vRef }) {
  function handleClick() {
    vRef.current.requestFullscreen();
  }

  return (
    <IconButton size='small' onClick={handleClick}>
      <FullscreenOutlined />
    </IconButton>
  );
}

export default FullScreenButton;