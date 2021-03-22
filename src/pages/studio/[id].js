import useSWR from 'swr';
import { useRouter, } from 'next/router';
import { useSession, } from 'next-auth/client';
import Layout from '../../components/Layout';
import Spinner from '../../components/Spinner';

import EditTitle from '../../components/Studio/EditTitle';
import DeleteVideo from '../../components/Studio/DeleteVideo';
import StudioVideo from '../../components/Studio/StudioVideo';
import EditVisibility from '../../components/Studio/EditVisibility';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function StudioEditVideo() {
  const router = useRouter();
  const [session, loading] = useSession();

  const { id } = router.query;
  const { data } = useSWR(id ? `/api/videos/${id}`: false, fetcher, { refreshInterval: 1000 });

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

  if (data && session && (session.id === data.userId)) {
    return (
      <Layout>
        <div className='w-full justify-center flex p-4'>
          <div className='min-w-screen-sm'>
            <div>
              <EditTitle id={data.videoId} title={data.title} />
            </div>
            <div className='flex'>
              <img
                alt='thumbnail'
                src={data.thumbnail}
                className="h-auto w-48"
                style={{ borderRadius:'4px' }}
              />
              <div className='flex-1 flex-col px-4'>
                <EditVisibility id={data.videoId} visibility={data.visibility} />
              </div>
            </div>
            <div className='my-2 flex justify-center'>
              <StudioVideo data={data}/>
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