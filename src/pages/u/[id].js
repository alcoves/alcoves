import useSWR from 'swr';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import Layout from '../../components/Layout';
import VideoGrid from '../../components/VideoGrid/Index';

const fetcher = (url) => fetch(url).then((res) => res.json());

function countViews(videos) {
  return videos.reduce((acc, cv) => {
    acc += cv.views;
    return acc;
  }, 0);
}

function UserProfile({ id }) {
  const { data: user } = useSWR(`/api/users/${id}`, fetcher);
  const { data: videos } = useSWR(`/api/videos?uid=${id}`, fetcher);
  const headerImageURL = 'https://images.unsplash.com/photo-1609771270965-aeda41eee819?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80';

  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <Layout>
        <div className='flex flex-col'>
          <div style={{
            width: '100%',
            height: '300px',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundImage: `url("${headerImageURL}")`,
          }}
          />
          <div className='flex flex-col mx-4'>
            <div className='flex flex-row'>
              {user && videos && (
                <div className='flex flex-row my-4'>
                  <img
                    alt='image'
                    src={user.image}
                    className='h-20 w-20 rounded-full'
                  />
                  <div className='flex flex-col justify-between ml-3'>
                    <h1 className='text-2xl text-gray-200 font-bold'>{user.name}</h1>
                    <div>
                      <p className='text-xs text-gray-400 font-semibold'>{`Public Videos: ${videos.length}`}</p>
                      <p className='text-xs text-gray-400 font-semibold'>{`Total Views: ${countViews(videos)}`}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div>
              {videos && <VideoGrid videos={videos} noUser />}
            </div>
          </div>
        </div>
      </Layout>
    </>
  );
}

export default function UserProfileIndex() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return <div />;
  return <UserProfile id={id} />;
}
