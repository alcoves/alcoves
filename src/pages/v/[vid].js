import Head from 'next/head';
import { useRouter, } from 'next/router';
import styled from 'styled-components';
import moment from 'moment';
import {
  Container,
  Typography,
} from '@material-ui/core';
import { useEffect, } from 'react';
import Layout from '../../components/Layout';
import { lazyApi, } from '../../utils/api';
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
  const [getVideo, { data, error, loading }] = lazyApi();

  useEffect(() => {
    if (vid) {
      getVideo({ url: `/videos/${vid}` });
    } 
  }, [vid]);

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
            <Container style={{ marginTop: '20px' }}>
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
                  <Typography variant='h4'>{data.title}</Typography>
                </div>
                <div>
                  <SubtitleContainer>
                    <div>
                      <Typography variant='body2'>
                        {`${abbreviateNumber(data.views)} views · ${moment(Number(data.createdAt)).fromNow()}`}
                      </Typography>
                      <Typography variant='subtitle2'>{data.visibility}</Typography>
                    </div>
                  </SubtitleContainer>
                </div>
              </div>
              <VideoPageUserCard id={data.user} />
            </Container>
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
