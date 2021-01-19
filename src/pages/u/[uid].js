import Head from 'next/head';
import { useRouter, } from 'next/router';
import styled from 'styled-components';
import Layout from '../../components/Layout';
import VideoGrid from '../../components/VideoGrid/Index';
import { useApi, } from '../../utils/api';

function countViews(videos) {
  return videos.reduce((acc, cv) => {
    acc += cv.views;
    return acc;
  }, 0);
}

const HeaderImage = styled.div`
  width: 100%;
  height: 300px;
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  background-image: url("${p => p.src}");
`;

function UserProfile({ uid }) {
  const { data: user } = useApi({ url: `/users/${uid}` });
  const { data: videos } = useApi({ url: `/videos?userId=${uid}` });

  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <Layout>
        <div className='flex flex-col'>
          <HeaderImage src='https://images.unsplash.com/photo-1609771270965-aeda41eee819?ixid=MXwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHw%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80' />
          <div className='flex flex-col mx-4'>
            <div className='flex flex-row'>
              {user && videos && (
                <div className='flex flex-row my-4'>
                  <img
                    alt='avatar'
                    src={user.avatar}
                    className='h-20 w-20 rounded-full'
                  />
                  <div className='flex flex-col justify-between ml-3'>
                    <h1 className='text-2xl text-gray-200 font-bold'>{user.username}</h1>
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
  const { uid } = router.query;
  if (!uid) return <div />;
  return <UserProfile uid={uid} />;
}
