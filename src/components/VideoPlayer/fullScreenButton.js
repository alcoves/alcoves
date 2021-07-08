import React from 'react';
import { IconButton, } from '@chakra-ui/react';
import { IoExpand, } from 'react-icons/io5';

function FullScreenButton({ toggle }) {
  return (
    <IconButton variant='ghost' size='sm'>
      <IoExpand
        size='20px'
        color='white'
        cursor='pointer'
        onClick={() => toggle()}
      />
    </IconButton>
  );
}

export default FullScreenButton;