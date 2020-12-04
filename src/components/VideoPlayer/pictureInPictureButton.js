import React from 'react';
import { IconButton, } from '../old/node_modules/@material-ui/core';
import { PictureInPictureOutlined, } from '../old/node_modules/@material-ui/icons';

function PictureInPictureButton({ vRef }) {
  function handleClick() {
    vRef.current.requestPictureInPicture();
  }

  return (
    <IconButton size='small' onClick={handleClick}>
      <PictureInPictureOutlined />
    </IconButton>
  );
}

export default PictureInPictureButton;