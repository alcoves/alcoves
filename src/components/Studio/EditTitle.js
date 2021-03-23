import axios from 'axios';
import { useEffect, useState, } from 'react';
import { Input } from "@chakra-ui/react"

let timer;

export default function EditTitle({ id, title: t }) {
  const [title, setTitle ] = useState(t);
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (t !== title) updateTitle(id, title);
  }, [title]);

  async function updateTitle() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('setting title');
      setLoading(true)
      axios.patch(`/api/videos/${id}`, { title }).then(() => {
        setLoading(false)
      }).catch((error) => {
        console.error(error)
        setLoading(false)
      })
    }, 1000);
  }

  return (
    <Input
      w='100%'
      size='sm'
      value={title}
      isDisabled={loading}
      placeholder='Enter a title'
      onChange={({ target }) => setTitle(target.value)}
      className='bg-transparent text-gray-200 w-full p-1 block rounded-md'
    />
  );
}