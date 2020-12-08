import { Pane, TextInput, Button, toaster, } from 'evergreen-ui';
import { useState, useEffect, } from 'react';
import { useApiLazy, } from '../../utils/api';

export default function EditTitle({ id, title: t }) {
  const [updateVideo, { data, loading, error }] = useApiLazy(`/videos/${id}`, 'patch');
  const [title, setTitle ] = useState(t);

  useEffect(() => {
    if (!loading && data) {
      toaster.success('Successfully updated video title');
    }

    if (!loading && error) {
      toaster.danger('Failed to update video title');
    }
  }, [loading]);

  return (
    <Pane
      display='flex'
    >
      <TextInput
        size={500}
        height={38}
        width='100%'
        onChange={({ target }) => {
          setTitle(target.value);
        }}
        name='title'
        value={title}
        placeholder='Enter a title'
      />
      <Button
        height={38}
        marginLeft={5}
        intent='success'
        isLoading={loading}
        appearance='minimal'
        onClick={() => {
          updateVideo({ data: { title }});
        }}
      >
        Save
      </Button>
    </Pane>
  );
}