
import { Box,Select,  } from 'grommet';
import { useState, } from 'react';
import { useApiLazy, } from '../../utils/api';

export default function EditVisibility({ id, visibility: v }) {
  const [updateVideo, { loading }] = useApiLazy(`/videos/${id}`, 'patch');
  const [visibility, setVisibility ] = useState(v);

  async function handleChange(vis) {
    await updateVideo({ data: { visibility: vis } });
    setVisibility(vis);
  }

  return (
    <Box>
      <Select
        value={visibility}
        disabled={loading}
        options={['unlisted', 'public']}
        onChange={({ option }) => handleChange(option)}
      />
    </Box>
  );
}