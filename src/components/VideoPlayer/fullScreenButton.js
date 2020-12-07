import React from 'react';
import Icon from '../Icon';

function FullScreenButton({ vRef }) {
  return (
    <Icon
      width={20}
      height={20}
      stroke='#fff'
      name='maximize'
      onClick={() => {
        vRef.current.requestFullscreen();
      }}
    />
  );
}

export default FullScreenButton;