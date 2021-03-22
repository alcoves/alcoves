import axios from 'axios';
import { useEffect, useState, } from 'react';

let timer;

export default function EditTitle({ id, title: t }) {
  const [title, setTitle ] = useState(t);

  useEffect(() => {
    if (t !== title) updateTitle(id, title);
  }, [title]);

  async function updateTitle() {
    clearTimeout(timer);
    timer = setTimeout(() => {
      console.log('setting title');
      axios.patch(`/api/videos/${id}`, { title });
    }, 1000);
  }

  return (
    <input
      value={title}
      placeholder='Enter a title'
      onChange={({ target }) => setTitle(target.value)}
      className='bg-transparent text-gray-200 w-full p-1 block rounded-md'
    />
  );
}