import { Pane, TextInput, Button, toaster, } from 'evergreen-ui';
import { useState, useEffect, } from 'react';
import { useApiLazy, } from '../../utils/api';

export default function EditTitle({ id, title: t }) {
  const [updateVideo, { loading, error }] = useApiLazy(`/videos/${id}`, 'patch');
  const [title, setTitle ] = useState(t);

  useEffect(() => {
    if (!loading && error) toaster.danger('Failed to update video title');
  }, [loading]);

  return (
    <Pane
      display='flex'
    >
      <TextInput
        size={500}
        height={38}
        width='100%'
        name='title'
        value={title}
        placeholder='Enter a title'
        onChange={({ target }) => setTitle(target.value)}
      />
      <Button
        height={38}
        marginLeft={5}
        intent='success'
        isLoading={loading}
        appearance='minimal'
        onClick={() => updateVideo({ data: { title }})}
      >
        Save
      </Button>
    </Pane>
  );
}