import moment from 'moment';
import { useRouter, } from 'next/router';
import abbreviateNumber from '../../utils/abbreviateNumber';

export default function VideoMeta({ v, u }) {
  const router = useRouter();

  return (
    <div className='flex flex-row justify-start my-2'>
      {u && (
        <img
          alt='image'
          src={u.image}
          className='w-12 h-12 rounded-full cursor-pointer'
          onClick={() => router.push(`/u/${v.user_id}`)}
        />
      )}
      <div style={{ paddingLeft: !u ? '0px' : '10px' }}>
        <p className='truncate text-lg text-gray-200 font-bold cursor-pointer' onClick={() => router.push(`/v/${v.video_id}`)}>
          {v.title}
        </p>
        {u && (
          <p
            className='text-sm font-semibold text-gray-200 cursor-pointer'
            onClick={() => router.push(`/u/${u.id}`)}
          >
            {u.name}
          </p>
        )}
        <p className='text-xs lowercase text-gray-400 font-bold'>
          {`${abbreviateNumber(v.views)} views · ${moment(v.created_at).fromNow()}`}
        </p>
      </div>
    </div>
  );
}