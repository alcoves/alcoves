import React from 'react';
import Icon from '../Icon';

function PictureInPictureButton({ vRef }) {
  return (
    <Icon
      width={20}
      height={20}
      stroke='#fff'
      name='monitor'
      onClick={() => {
        vRef.current.requestPictureInPicture();
      }}
    />
  );
}

export default PictureInPictureButton;