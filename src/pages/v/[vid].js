import Head from 'next/head';
import { useRouter, } from 'next/router';
import moment from 'moment';
import { useEffect, } from 'react';
import { Box, Heading, Text, } from 'grommet';
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
          <Box>
            <VideoPlayer url={data.url} />
            <Box margin='small'>
              <Heading level='3' margin='xsmall'>{data.title}</Heading>
              <Text margin='xsmall' size='small'>
                {subHeader}
              </Text>
              <VideoPageUserCard id={data.userId} />
            </Box>
          </Box>
        </Layout>
      </>
    );
  }

  if (error) {
    return (
      <Layout>
        <Box justify='center'>
          <Heading> There was an error loading this video </Heading>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box align='center'>
        <Spinner />
      </Box>
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
