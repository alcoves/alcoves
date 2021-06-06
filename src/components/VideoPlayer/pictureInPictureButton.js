import React from 'react';
import { Box, } from '@chakra-ui/react';
import { IoOpenOutline, } from 'react-icons/io5';

function PictureInPictureButton({ vRef }) {
  return (
    <Box mx='2'>
      <IoOpenOutline
        size='1.3rem'  
        stroke='white'
        cursor='pointer'
        onClick={() => { vRef.current.requestPictureInPicture(); }}
      />
    </Box>
  );
}

export default PictureInPictureButton;