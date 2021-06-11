import React from 'react';
import { Box, } from '@chakra-ui/react';
import { IoExpand, } from 'react-icons/io5';

function FullScreenButton({ vRef }) {
  return (
    <Box>
      <IoExpand
        size='20px'
        stroke='white'
        cursor='pointer'
        onClick={() => { vRef.current.requestFullscreen(); }}
      />
    </Box>
  );
}

export default FullScreenButton;