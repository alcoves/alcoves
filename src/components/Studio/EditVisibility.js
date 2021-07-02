import axios from 'axios';
import { useState, } from 'react';
import { IconButton, } from '@chakra-ui/react';
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

  return (
    <IconButton
      size='sm'
      rounded='md'
      isLoading={loading}
      onClick={handleChange}
      aria-label='Toggle visibility'
      colorScheme={visibility === 'public' ? 'teal' : 'gray'}
      icon={visibility === 'public' ? <IoEye color='inherit'/> : <IoEyeOff color='inherit'/>}
    />
  );
}