import Head from 'next/head';
import moment from 'moment';
import useSWR from 'swr';
import { CircularProgress, Flex, Box, Text, Heading,  } from '@chakra-ui/react';
import { useEffect, useRef, } from 'react';
import axios from 'axios';
import { useRouter, } from 'next/router';
import Layout from '../../components/Layout';
// import VideoPlayer from '../../components/VideoPlayer/index';
import abbreviateNumber from '../../utils/abbreviateNumber';
import VideoPageUserCard from '../../components/VideoPageUserCard';
import ShareModal from '../../components/ShareModal';

const fetcher = (url) => fetch(url).then((res) => res.json());

let hls;

export default function Video({ url, video: v }) {
  const vRef = useRef(null);
  const router = useRouter();
  const { data } = useSWR(url, fetcher, { initialData: v });

  useEffect(() => {
    axios.post(`/api/videos/${v.videoId}/views`).catch((err) =>{
      console.error('error counting video view', err);
    });
  }, []);

  useEffect(() => {
    if (data.hlsMasterLink) {
      const video = document.getElementById('bkenVideoPlayer');
      hls = new window.Hls();
      hls.loadSource(data.hlsMasterLink);
      hls.attachMedia(video);

      if (router?.query?.t) {
        console.log('seeking to', router.query.t);
        video.currentTime = router.query.t;
      }
    }
  }, [data]);
  
  if (data?.status === 'completed') {
    const subHeader = `${
      abbreviateNumber(data.views)} views ·
      ${moment(data.createdAt).fromNow()} · 
      ${data.visibility}
    `;

    return (
      <Box>
        <Head>
          <title>{data.title}</title>
          <meta property='og:title' content={data.title} />
          <meta property='og:image' content={data.thumbnail} />
          <meta property='og:description' content={data.title} />
        </Head>
        <Layout>
          <Box>
            {/* <VideoPlayer url={data.hlsMasterLink} /> */}
            <video
              autoPlay
              controls
              ref={vRef}
              id='bkenVideoPlayer'
              style={{
                background: 'black',
                minHeight: '280px',
                height: 'calc(100vh - 300px)',
                maxHeight: 'calc((9 / 16) * 100vw)',
                minWidth:'100%',
              }}
            />
            <Flex w='100%' justifyContent='center'>
              <Box p='4' w='1024px'>
                <Heading as='h3' size='lg'>{data.title}</Heading>
                <Flex justifyContent='space-between'>
                  <Text fontSize='sm'>{subHeader}</Text>
                  <ShareModal vRef={vRef} link={`https://bken.io/v/${data.videoId}`}/>
                </Flex>
                <VideoPageUserCard id={data.userId} />
              </Box>
            </Flex>
          </Box>
        </Layout>
      </Box>
    );
  }

  return (
    <Layout>
      <Flex justify='center' flexDirection='column' align='center' pt='25px'>
        <Heading pb='25px'>This video is not quite ready</Heading>
        {data.percentCompleted !== '100' && <CircularProgress value={data.percentCompleted} />}
        <div>Status: {data.status}</div>
      </Flex>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const url = `http://localhost:3000/api/videos/${params.id}`;
  const video = await fetcher(url);
  return { props: { video, url, id: params.id } };
}
