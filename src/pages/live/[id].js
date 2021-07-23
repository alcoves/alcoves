import { Flex, Text, } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import VideoPlayer from '../../components/VideoPlayer/Index';

export default function LiveVideo({
  hlsUrl, dashUrl, id, 
}) {
  return (
    <Layout>
      <VideoPlayer id='bkenLivePlayer' url={dashUrl}/>
      <Flex direction='column'>
        <Text>Stream ID: {id}</Text>
        <Text>HLS Manifest: {hlsUrl}</Text>
        <Text>Dash Manifest: {dashUrl}</Text>
      </Flex>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const baseUrl = 'https://cdn.bken.io/live';
  const hlsUrl = `${baseUrl}/${params.id}/master.m3u8`;
  const dashUrl = `${baseUrl}/${params.id}/manifest.mpd`;
  return {
    props: {
      hlsUrl, dashUrl, id: params.id, 
    }, 
  };
}