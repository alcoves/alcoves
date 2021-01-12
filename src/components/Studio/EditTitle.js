import { useState, useEffect, } from 'react';
import { useApiLazy, } from '../../utils/api';

export default function EditTitle({ id, title: t }) {
  const [updateVideo, { loading, error }] = useApiLazy(`/videos/${id}`, 'patch');
  const [title, setTitle ] = useState(t);

  // useEffect(() => {
  //   if (!loading && error) toaster.danger('Failed to update video title');
  // }, [loading]);

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
        className='w-max px-5 py-1 border rounded-md text-gray-300'
        onClick={() => updateVideo({ data: { title }})}
      >
        Save
      </button>
    </div>
  );
}