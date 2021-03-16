import { useRouter, } from 'next/router';
import { useEffect, useRef, } from 'react';
import Layout from '../../components/Layout';
import { useApiLazy, } from '../../utils/api';
import Spinner from '../../components/Spinner';

import EditTitle from '../../components/Studio/EditTitle';
import DeleteVideo from '../../components/Studio/DeleteVideo';
import ListRenditions from '../../components/Studio/ListRenditions';
import EditVisibility from '../../components/Studio/EditVisibility';

let hls;

export default function StudioEditVideo() {
  const vRef = useRef(null);
  // const { user, authenticated, loading } = useContext(Context);
  const [getVideo, { data }] = useApiLazy();
  const router = useRouter();
  const { vid } = router.query;

  useEffect(() => {
    if (!loading && !authenticated) {
      return router.push(`/login?redirect=${router.asPath}`);
    }
    
    if (vid) {
      getVideo({ url: `/videos/${vid}` });
    }
  }, [vid]);

  useEffect(() => {
    if (data) {
      const video = document.getElementById('bkenStudioVideoPlayer');
      hls = new window.Hls({ startLevel: 3 });
      hls.loadSource(data.hls_master_link);
      hls.attachMedia(video);
    }
  });

  if (data && authenticated) {
    if (data?.userId !== user?.id) {
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

    return (
      <Layout>
        <div className='w-full justify-center flex p-4'>
          <div className='max-w-screen-sm'>
            <div>
              <EditTitle id={data.id} title={data.title} />
              <EditVisibility id={data.id} visibility={data.visibility} />
              <ListRenditions id={data.id} />
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
              <DeleteVideo id={data.id} />
              <button
                type='button'
                onClick={() => router.push(`/v/${vid}`)}
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