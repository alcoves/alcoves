import Head from 'next/head';
import moment from 'moment';
import useSWR from 'swr';
import { CircularProgress, Flex, Box, Text, Heading,  } from '@chakra-ui/react';
import { useEffect, } from 'react';
import axios from 'axios';
import Layout from '../../components/Layout';
import VideoPlayer from '../../components/VideoPlayer/index';
import abbreviateNumber from '../../utils/abbreviateNumber';
import VideoPageUserCard from '../../components/VideoPageUserCard';
import ShareModal from '../../components/ShareModal';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function Video({ url, video: v }) {
  const { data } = useSWR(url, fetcher, { initialData: v });

  useEffect(() => {
    axios.post(`/api/videos/${v.videoId}/views`).catch((err) =>{
      console.error('error counting video view', err);
    });
  }, []);
  
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
          <meta property='og:secure_url' content={data.thumbnail} />
          <meta property='og:url' content={`https://bken.io/v/${data.id}`} />
          <meta property='og:site_name' content='bken.io'/>
          <meta property='og:type' content='video.other' />
          <meta property='og:image:width' content='1280' />
          <meta property='og:image:height' content='720' />
          <meta property='og:video:type' content='video/mp4'/>
          <meta property='og:video:width' content='1280'/>
          <meta property='og:video:height' content='720'/>
          <meta property='og:image:type' content='image/webp' />
          <meta property='og:description' content={data.title} />

          <meta name='og:title' content={data.title} />
          <meta name='description' content={`Watch ${data.title} on bken.io`} />
          <meta name='twitter:card' content='player'/>
          <meta name='twitter:site' content='@rustyguts'/>
          <meta name='twitter:image' content={data.thumbnail}/>
          <meta name='twitter:player:width' content='1280'/>
          <meta name='twitter:player:height' content='720'/>
        </Head>
        <Layout>
          <Box>
            <VideoPlayer url={data.mpdLink} thumbnail={data.thumbnail}/>
            <Flex w='100%' justifyContent='center'>
              <Box p='4' w='1024px'>
                <Heading as='h3' size='lg'>{data.title}</Heading>
                <Flex justifyContent='space-between'>
                  <Text fontSize='sm'>{subHeader}</Text>
                  <ShareModal link={`https://bken.io/v/${data.videoId}`}/>
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
