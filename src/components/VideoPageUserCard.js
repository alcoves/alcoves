import { useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { useApiLazy, } from '../utils/api';

function VideoPageUserCard({ id }) {
  const router = useRouter();
  const [getUser, { data }] = useApiLazy({ url: `/users/${id}` });
  useEffect(() => { getUser(); }, []);

  if (data) {
    return (
      <div className='flex flex-row h-12 mt-3'>
        <img
          className='cursor-pointer w-12 h-12 rounded-full mr-3'
          alt='avatar'
          src={data.avatar}
          onClick={() => router.push(`/u/${data.id}`)}
        />
        <div margin='small'>
          <p
            className='cursor-pointer text-lg font-semibold text-gray-200'
            onClick={() => router.push(`/u/${data.id}`)}
          >
            {data.username}
          </p>
        </div>
      </div>
    );
  }

  return <div />; 
}

export default VideoPageUserCard;