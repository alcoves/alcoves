import { useState, } from 'react';
import { useApiLazy, } from '../../utils/api';

export default function EditVisibility({ id, visibility: v }) {
  const [updateVideo] = useApiLazy({ url: `/videos/${id}`, method: 'patch' });
  const [visibility, setVisibility ] = useState(v);

  async function handleChange(vis) {
    await updateVideo({ data: { visibility: vis.toLowerCase() } });
    setVisibility(vis);
  }

  return (
    <div className='flex flex-row my-2'>
      <select
        id='visibility'
        name='visibility'
        defaultValue={visibility}
        onChange={(e) => handleChange(e.target.value)}
        className='bg-gray-700 text-gray-200 w-full rounded-md p-2'
      >
        <option value={'public'}>Public</option>
        <option value={'unlisted'}>Unlisted</option>
      </select>
    </div>
  );
}