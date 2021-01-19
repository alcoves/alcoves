import Head from 'next/head';
import { useRouter, } from 'next/router';
import moment from 'moment';
import { useEffect, } from 'react';
import Layout from '../../components/Layout';
import { useApiLazy, fetch, } from '../../utils/api';
import VideoPlayer from '../../components/VideoPlayer/index';
import abbreviateNumber from '../../utils/abbreviateNumber';
import VideoPageUserCard from '../../components/VideoPageUserCard';
import Spinner from '../../components/Spinner';

export default function Video({ video }) {
  const router = useRouter();
  const { vid } = router.query;
  const [watchVideo, { called: watchVideoCalled }] = useApiLazy();

  useEffect(() => {
    if (video && vid && !watchVideoCalled) {
      watchVideo({ method: 'post', url: `/videos/${vid}/views` });
    } 
  }, [video]);

  if (video) {
    const subHeader = `${
      abbreviateNumber(video.views)} views ·
      ${moment(video.createdAt).fromNow()} · 
      ${video.visibility}
    `;

    return (
      <div>
        <Head>
          <title>{video.title}</title>
          <meta property='og:title' content={video.title} />
          <meta property='og:image' content={video.thumbnail} />
          <meta property='og:description' content={video.title} />
        </Head>
        <Layout>
          <div>
            <VideoPlayer url={video.url} />
            <div className='m-3 flex flex-col'>
              <h1 className='text-3xl font-semibold text-gray-200'>{video.title}</h1>
              <p className='text-sm font-semibold text-gray-400'>
                {subHeader}
              </p>
              <VideoPageUserCard id={video.userId} />
            </div>
          </div>
        </Layout>
      </div>
    );
  }

  return (
    <Layout>
      <div align='center'>
        <Spinner />
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { data } = await fetch({ url: `/videos/${params.vid}` });
    return { props: { video: data } };
  } catch (error) {
    return { props: { error: error.message } };
  }
}
