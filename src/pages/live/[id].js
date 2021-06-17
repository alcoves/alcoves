import { Flex, Text, } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import VideoPlayer from '../../components/VideoPlayer/index';

export default function LiveVideo({ url, id }) {
  return (
    <Layout>
      <VideoPlayer id='bkenLivePlayer' url={url} mode='live'/>
      <Flex direction='column'>
        <Text>Stream ID: {id}</Text>
        <Text>Stream URL: {url}</Text>
      </Flex>
    </Layout>
  );
}

export async function getServerSideProps({ params }) {
  const url = `https://live.bken.io/dash/${params.id}.mpd`;
  return { props: { url, id: params.id } };
}