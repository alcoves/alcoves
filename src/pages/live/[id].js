import { Flex, Text, } from '@chakra-ui/react';
import { useEffect, useState, } from 'react';
import Layout from '../../components/Layout';
import VideoPlayer from '../../components/VideoPlayer/index';

function HLSVideoPlayer({ url }) {
  const [hls, setHls] = useState(null);
  useEffect(() => {
    setHls(new Hls());
  }, []);

  useEffect(() => {
    if (hls) {
      const video = document.getElementById('bkenLiveVideoPlayer');
      hls.loadSource(url);
      hls.attachMedia(video);
    }
  }, [hls]);

  return (
    <video muted autoPlay controls id='bkenLiveVideoPlayer'/>
  );
}

export default function LiveVideo({ hlsUrl, dashUrl, id }) {
  return (
    <Layout>
      {/* <HLSVideoPlayer url={hlsUrl}/> */}
      <VideoPlayer id='bkenLivePlayer' url={dashUrl} mode='live'/>
      <Flex direction='column'>
        <Text>Stream ID: {id}</Text>
        <Text>HLS Manifest: {hlsUrl}</Text>
        <Text>Dash Manifest: {dashUrl}</Text>
      </Flex>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const hlsUrl = `https://live.bken.io/hls/${params.id}.m3u8`;
  const dashUrl = `https://live.bken.io/dash/${params.id}.mpd`;
  return { props: { hlsUrl, dashUrl, id: params.id } };
}