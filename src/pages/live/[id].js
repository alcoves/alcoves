import { Flex, Text, } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import VideoPlayer from '../../components/VideoPlayer/index';

let player;

export default function LiveVideo({ url, id }) {
  return (
    <Layout>
      <VideoPlayer player={player} url={url} />
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