import Head from 'next/head';
import { useRouter, } from 'next/router';
import moment from 'moment';
import { useEffect, } from 'react';
import Layout from '../../components/Layout';
import { useApiLazy, } from '../../utils/api';
import VideoPlayer from '../../components/VideoPlayer/index';
import abbreviateNumber from '../../utils/abbreviateNumber';
import VideoPageUserCard from '../../components/VideoPageUserCard';
import Spinner from '../../components/Spinner';

// function GoogleAds() {
//   useEffect(() => {
//     (window.adsbygoogle = window.adsbygoogle || []).push({});
//   }, []);

//   return (
//     <ins
//       data-ad-format='auto'
//       className='adsbygoogle'
//       data-ad-slot='7992005664'
//       style={{ display: 'block' }}
//       data-full-width-responsive='true'
//       data-ad-client='ca-pub-1017771648826122'
//     />
//   );
// }

export default function Video() {
  const router = useRouter();
  const { vid } = router.query;
  const [getVideo, { data, error }] = useApiLazy();
  const [watchVideo, { called: watchVideoCalled }] = useApiLazy();

  useEffect(() => {
    if (vid) {
      getVideo({ url: `/videos/${vid}` });
    } 
  }, [vid]);

  useEffect(() => {
    if (data && vid && !watchVideoCalled) {
      watchVideo({ method: 'post', url: `/videos/${vid}/views` });
    } 
  }, [data]);

  if (data) {
    const subHeader = `${
      abbreviateNumber(data.views)} views ·
      ${moment(data.createdAt).fromNow()} · 
      ${data.visibility}
    `;

    return (
      <>
        <Head>
          <title>{data.title}</title>
        </Head>
        <Layout>
          <div>
            <VideoPlayer url={data.url} />
            <div className='m-3 flex flex-col'>
              <h1 className='text-3xl font-semibold text-gray-200'>{data.title}</h1>
              <p className='text-sm font-semibold text-gray-400'>
                {subHeader}
              </p>
              <VideoPageUserCard id={data.userId} />
            </div>
          </div>
        </Layout>
      </>
    );
  }

  if (error) {
    return (
      <Layout>
        <div justify='center'>
          <h1> There was an error loading this video </h1>
        </div>
      </Layout>
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

// export async function getServerSideProps({ params }) {
//   try {
//     const { data } = await ssrApi(`/videos/${params.vid}`);
//     return { props: { video: data } };
//   } catch (error) {
//     return { props: { error: error.message } };
//   }
// }
