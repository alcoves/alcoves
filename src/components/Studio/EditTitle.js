import axios from 'axios';
import { useEffect, useState, } from 'react';
import {
  Input, InputGroup, InputLeftAddon, 
} from '@chakra-ui/react';

let timer;

export default function EditTitle({
  id, title: t, refetch, 
}) {
  const [title, setTitle ] = useState(t);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (t !== title) updateTitle(id, title);
  }, [title]);

  async function updateTitle() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('setting title');
      setLoading(true);
      axios.patch(`/api/videos/${id}`, { title }).then(() => {
        if (refetch) refetch();
        setLoading(false);
      }).catch((error) => {
        console.error(error);
        setLoading(false);
      });
    }, 1000);
  }

  return (
    <InputGroup size='sm'>
      <InputLeftAddon>
        Title
      </InputLeftAddon>
      <Input
        w='100%'
        value={title}
        variant='filled'
        isDisabled={loading}
        placeholder='Enter a title'
        onChange={({ target }) => setTitle(target.value)}
      />
    </InputGroup>
  );
}