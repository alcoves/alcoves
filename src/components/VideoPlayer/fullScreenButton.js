import React from 'react';
import { Box, } from '@chakra-ui/react';
import { IoExpand, } from 'react-icons/io5';
import { detect, } from'detect-browser';

const browser = detect();

function FullScreenButton({ vRef }) {
  switch (browser && browser.name) {
  case 'edge':
  case 'opera':
  case 'safari':
  case 'chrome':
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
  default:
    return <div />;
  }
}

export default FullScreenButton;