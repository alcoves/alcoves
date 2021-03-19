import axios from 'axios';
import { useEffect, useState, } from 'react';

export default function EditTitle({ id, title: t }) {
  const [loading, setLoading] = useState(false);
  const [title, setTitle ] = useState(t);

  useEffect(() => {
    if (t !== title) updateTitle(id, title)
  }, [title])

  async function updateTitle() {
    try {
      setLoading(true)
      await axios.patch(`/api/videos/${id}`, { title })
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className='flex flex-row my-2'>
      <input
        value={title}
        placeholder='Enter a title'
        onChange={({ target }) => setTitle(target.value)}
        className='bg-gray-700 text-gray-200 w-full p-2 mr-2 block rounded-md'
      />
      <button
        type='button'
        disabled={loading}
        onClick={() => updateTitle()}
        className={`w-max px-5 py-1 border rounded-md ${loading ? 'text-gray-400' : 'text-gray-300'}`}
      >
        Save
      </button>
    </div>
  );
}