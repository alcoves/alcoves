import { Box, TextInput, Button, } from 'grommet';
import { useState, useEffect, } from 'react';
import { useApiLazy, } from '../../utils/api';

export default function EditTitle({ id, title: t }) {
  const [updateVideo, { loading, error }] = useApiLazy(`/videos/${id}`, 'patch');
  const [title, setTitle ] = useState(t);

  // useEffect(() => {
  //   if (!loading && error) toaster.danger('Failed to update video title');
  // }, [loading]);

  return (
    <Box direction='row'>
      <TextInput
        width='100%'
        name='title'
        value={title}
        placeholder='Enter a title'
        onChange={({ target }) => setTitle(target.value)}
      />
      <Button
        primary
        label='Save'
        size='xsmall'
        margin='xsmall'
        disabled={loading}
        onClick={() => updateVideo({ data: { title }})}
      />
    </Box>
  );
}