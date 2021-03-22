import useSWR from 'swr';
import { useRouter, } from 'next/router';
import { useEffect, useRef, } from 'react';
import { useSession, } from 'next-auth/client';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';

import EditTitle from '../../components/Studio/EditTitle';
import DeleteVideo from '../../components/Studio/DeleteVideo';
import ListRenditions from '../../components/Studio/ListRenditions';
import EditVisibility from '../../components/Studio/EditVisibility';

let hls;
const fetcher = (url) => fetch(url).then((res) => res.json());

export default function StudioEditVideo() {
  const vRef = useRef(null);
  const router = useRouter();
  const [session, loading] = useSession();

  const { id } = router.query;
  const { data } = useSWR(id ? `/api/videos/${id}`: false, fetcher, { refreshInterval: 1000 });

  useEffect(() => {
    if (data?.hlsMasterLink) {
      const video = document.getElementById('bkenStudioVideoPlayer');
      hls = new window.Hls({ startLevel: 3 });
      hls.loadSource(data.hlsMasterLink);
      hls.attachMedia(video);
    }
  }, []);

  if (!loading && !session) {
    return (
      <Layout>
        <div className='w-full justify-center flex p-4'>
          <div className='text-gray-200 uppercase text-3xl font-extrabold h-8 py-1 px-2 tracking-wide'>
            Not Allowed
          </div>
        </div>
      </Layout>
    );
  }

  if (data && (session.id === data.userId)) {
    return (
      <Layout>
        <div className='w-full justify-center flex p-4'>
          <div className='max-w-screen-sm'>
            <div>
              <EditTitle id={data.videoId} title={data.title} />
              <EditVisibility id={data.videoId} visibility={data.visibility} />
              <ListRenditions id={data.videoId} />
            </div>
            <div>
              <img
                width='100%'
                alt='thumbnail'
                src={data.thumbnail}
                style={{ borderRadius:'4px' }}
              />
            </div>
            <div className='my-2 flex justify-center'>
              {data.status === 'completed' && <video
                className='rounded-md max-h-96 min-h-96'
                controls 
                ref={vRef}
                id='bkenStudioVideoPlayer'
              />
              }
            </div>
            <div className='flex flex-row justify-between py-2'>
              <DeleteVideo id={data.videoId} />
              <button
                type='button'
                onClick={() => router.push(`/v/${id}`)}
                className='text-gray-200 border rounded-md uppercase text-sm font-medium h-8 py-1 px-2 tracking-wide'
              >
                View
              </button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className='flex w-full justify-center'>
        <Spinner />
      </div>
    </Layout>
  );
}