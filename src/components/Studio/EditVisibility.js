
import { Box,Select,  } from 'grommet';
import { useState, useEffect, } from 'react';
import { useApiLazy, } from '../../utils/api';

export default function EditVisibility({ id, visibility: v }) {
  const [updateVideo, { loading, error }] = useApiLazy(`/videos/${id}`, 'patch');
  const [visibility, setVisibility ] = useState(v);

  // useEffect(() => {
  //   if (!loading && error) {
  //     toaster.danger('Failed to update video visibility');
  //   }
  // }, [loading]);

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