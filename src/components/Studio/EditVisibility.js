import axios from 'axios';
import { useState, } from 'react';

export default function EditVisibility({ id, visibility: v }) {
  const [visibility, setVisibility ] = useState(v);

  async function handleChange(v) {
    try {
      setVisibility(v);
      await axios.patch(`/api/videos/${id}`, { visibility: v.toLowerCase() });
    } catch (error) {
      console.error(error);
    }
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
        <option value='public'>Public</option>
        <option value='unlisted'>Unlisted</option>
      </select>
    </div>
  );
}