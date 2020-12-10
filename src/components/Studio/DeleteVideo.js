import { Text, Pane, Dialog, Button, } from 'evergreen-ui';
import { useRouter, } from 'next/router';
import { useState, } from 'react';
import { useApiLazy, } from '../../utils/api';

export default function DeleteVideo({ id }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteVideo, { loading, data }] = useApiLazy(`/videos/${id}`, 'delete');
  if (data) router.push('/studio');

  return (
    <Pane>
      <Dialog
        isShown={open}
        intent='danger'
        isConfirmLoading={loading}
        onConfirm={() => deleteVideo()}
        confirmLabel='Permenantly Delete'
        title='Permenantly Delete This Video'
        onCloseComplete={() => setOpen(false)}
      >
        <Text>
          Are you absolutely sure you want to delete this video?
          This action cannot be undone.
        </Text>
      </Dialog>
      <Button
        intent='danger'
        appearance='primary'
        onClick={() => setOpen(true)}
      >
        Delete
      </Button>
    </Pane>
  );
}