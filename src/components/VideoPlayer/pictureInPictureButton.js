import React from 'react';
import { Box, } from '@chakra-ui/react';
import { IoOpenOutline, } from 'react-icons/io5';
import { detect, } from'detect-browser';

const browser = detect();

function PictureInPictureButton({ vRef }) {
  switch (browser && browser.name) {
  case 'edge':
  case 'opera':
  case 'safari':
  case 'chrome':
    return (
      <Box mx='2'>
        <IoOpenOutline
          size='20px'  
          stroke='white'
          cursor='pointer'
          onClick={() => { vRef.current.requestPictureInPicture(); }}
        />
      </Box>
    );
  default:
    return <div />;
  }
}

export default PictureInPictureButton;