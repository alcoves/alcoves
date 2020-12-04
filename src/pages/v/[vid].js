import Head from 'next/head';
import Link from 'next/link';

import styled from 'styled-components';
import moment from 'moment';
import {
  Container,
  Typography,
  IconButton,
} from '@material-ui/core';
import { ThumbUpOutlined, } from '@material-ui/icons';
import Layout from '../../components/Layout';
import api from '../../utils/api';
import VideoPlayer from '../../components/VideoPlayer/index';
import abbreviateNumber from '../../utils/abbreviateNumber';

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

export default function Video({ error, video }) {
  if (error) {
    return (
      <div>
        there was an error
      </div>
    );
  }

  const videoUrl = 'https://cdn.bken.io/v/sUqq0SBBFfu3dISHrssz_/hls/master.m3u8' || video.url;

  return (
    <div>
      <Head>
        <title>{video.title}</title>
      </Head>
      <Layout />

      <VideoContainerWrapper>
        <VideoPlayer url={videoUrl} />
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
              <Typography variant='h4'>{video.title}</Typography>
            </div>
            <div>
              <SubtitleContainer>
                <div>
                  <Typography variant='body2'>
                    {`${abbreviateNumber(video.views)} views · ${moment(Number(video.createdAt)).fromNow()}`}
                  </Typography>
                  <Typography variant='subtitle2'>{video.visibility}</Typography>
                </div>
                <div>
                  <IconButton disabled>
                    <ThumbUpOutlined />
                  </IconButton>
                </div>
              </SubtitleContainer>
            </div>
          </div>
          <div
            style={{
              display: 'flex',
              marginTop: '10px',
              height: '75px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginRight: '10px',
              }}
            >
              <Link href={`/users/${video.user.username}`} passHref>
                <img
                  alt=''
                  width={50}
                  height={50}
                  src={video.user.avatar}
                  style={{
                    borderRadius: '50%',
                    cursor: 'pointer',
                  }}
                />
              </Link>
            </div>
            <div style={{ height: '100%' }}>
              <Link
                href={`/users/${video.user.username}`}
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  height: '50%',
                }}
              >
                <a>{video.user.username}</a>
              </Link>
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  height: '50%',
                }}
              />
            </div>
          </div>
        </Container>
        {/* <GoogleAds /> */}
      </VideoContainerWrapper>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  try {
    const { data } = await api(`videos/${params.vid}`);
    return { props: { video: data } };
  } catch (error) {
    return { props: { error: true } };
  }
}
