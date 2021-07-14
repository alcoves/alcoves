import axios from 'axios';
import { useState, } from 'react';
import { Box, Button, Text, Tooltip, } from '@chakra-ui/react';
import { IoEyeOff, IoEye, } from 'react-icons/io5';

export default function EditVisibility({ id, visibility: v }) {
  const [visibility, setVisibility ] = useState(v);
  const [loading, setLoading] = useState(false);

  async function handleChange() {
    try {
      setLoading(true);
      const toggledVis = visibility === 'public' ? 'unlisted' : 'public';
      setVisibility(toggledVis);
      await axios.patch(`/api/videos/${id}`, { visibility: toggledVis.toLowerCase() });
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  function toolTipText() {
    if (visibility === 'public') {
      return 'Public videos will be displayed on your profile and show up in searches';
    }
    return 'Unlisted videos are accessible to anyone with the link';
  }

  return (
    <Box>
      <Tooltip openDelay={300} label={toolTipText()} aria-label='video-visibility'>
        <Button
          size='sm'
          isLoading={loading}
          onClick={handleChange}
          aria-label='Toggle visibility'
          colorScheme={visibility === 'public' ? 'teal' : 'gray'}
          leftIcon={visibility === 'public' ? <IoEye color='inherit'/> : <IoEyeOff color='inherit'/>}
        >
          <Text textTransform='capitalize'>
            {visibility}
          </Text>
        </Button>
      </Tooltip>
    </Box>
  );
}