import useSWR from 'swr';
import { useRouter, } from 'next/router';

const fetcher = (url) => fetch(url).then((res) => res.json());

function VideoPageUserCard({ id }) {
  const router = useRouter();
  const { data } = useSWR(id ? `/api/users/${id}` : false, fetcher);

  if (data) {
    return (
      <div className='flex flex-row h-12 mt-3'>
        <img
          alt='image'
          src={data.image}
          onClick={() => router.push(`/u/${data.userId}`)}
          className='cursor-pointer w-12 h-12 rounded-full mr-3'
        />
        <div margin='small'>
          <p
            onClick={() => router.push(`/u/${data.userId}`)}
            className='cursor-pointer text-lg font-semibold text-gray-200'
          >
            {data.name}
          </p>
        </div>
      </div>
    );
  }

  return <div />; 
}

export default VideoPageUserCard;