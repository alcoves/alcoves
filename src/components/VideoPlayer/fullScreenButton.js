import React from 'react';
import { IconButton, } from '@chakra-ui/react';
import { IoExpand, } from 'react-icons/io5';

function FullScreenButton({ vRef }) {
  return (
    <IconButton variant='ghost' size='sm'>
      <IoExpand
        size='20px'
        color='white'
        cursor='pointer'
        onClick={() => { vRef.current.requestFullscreen(); }}
      />
    </IconButton>
  );
}

export default FullScreenButton;