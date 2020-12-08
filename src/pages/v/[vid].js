import Head from 'next/head';
import { useRouter, } from 'next/router';
import styled from 'styled-components';
import moment from 'moment';
import { useEffect, } from 'react';
import { Heading, Text, Pane, } from 'evergreen-ui';
import Layout from '../../components/Layout';
import { useApiLazy, } from '../../utils/api';
import VideoPlayer from '../../components/VideoPlayer/index';
import abbreviateNumber from '../../utils/abbreviateNumber';
import VideoPageUserCard from '../../components/VideoPageUserCard';

const SubtitleContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const VideoContainerWrapper = styled.div`
  display: flex;
  flex-direction: column;
`;

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
  const [getVideo, { data, error, loading }] = useApiLazy();
  const [watchVideo, { called: watchVideoCalled }] = useApiLazy();

  useEffect(() => {
    if (vid) {
      getVideo({ url: `/videos/${vid}` });
    } 
  }, [vid]);

  useEffect(() => {
    if (data && vid && !watchVideoCalled) {
      watchVideo({ method: 'post', url: `/views/${vid}` });
    } 
  }, [data]);

  if (error) {
    return ( <div> There was an error </div> );
  }

  if (loading) {
    return ( <div> Loading... </div> );
  }

  if (data) {
    return (
      <>
        <Head>
          <title>{data.title}</title>
        </Head>
        <Layout>
          <VideoContainerWrapper>
            <VideoPlayer url={data.url} />
            <Pane marginTop={20} marginLeft={20} marginRight={20}>
              <div>
                <div
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    alignContent: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Heading size={600}>{data.title}</Heading>
                </div>
                <div>
                  <SubtitleContainer>
                    <div>
                      <Text size={400}>
                        {`${abbreviateNumber(data.views)} views · ${moment(data.createdAt).fromNow()}`}
                      </Text>
                      <Text size={400}>{data.visibility}</Text>
                    </div>
                  </SubtitleContainer>
                </div>
              </div>
              <VideoPageUserCard id={data.userId} />
            </Pane>
          </VideoContainerWrapper>
        </Layout>
      </>
    );
  }

  return (
    <>
      how did we get here?
    </>
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
