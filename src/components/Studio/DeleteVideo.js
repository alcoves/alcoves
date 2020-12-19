import { useRouter, } from 'next/router';
import { useState, } from 'react';
import { Heading, Box, Text, Layer, Button, } from 'grommet';
import { useApiLazy, } from '../../utils/api';

export default function DeleteVideo({ id }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [deleteVideo, { loading, data }] = useApiLazy(`/videos/${id}`, 'delete');
  if (data) router.push('/studio');

  return (
    <Box>
      <Button
        primary
        label='Delete'
        color='status-critical'
        onClick={() => setOpen(true)}
      />
      {open && (
        <Layer
          onEsc={() => setOpen(false)}
          onClickOutside={() => setOpen(false)}
        >
          <Box pad='medium'>
            <Heading level='3'>
              Permenantly Delete This Video
            </Heading>
            <Text>
              Are you absolutely sure you want to delete this video?
              This action cannot be undone.
            </Text>
            <br />
            <Box direction='row' justify='end'>
              <Button
                label='Close'
                margin='small'
                onClick={() => setOpen(false)}
              />
              <Button
                primary
                margin='small'
                disabled={loading}
                color='status-critical'
                label='Permenantly Delete'
                onClick={() => {
                  deleteVideo();
                  setOpen(false);
                }}
              />
            </Box>
          </Box>
        </Layer>
      )}
    </Box>
  );
}