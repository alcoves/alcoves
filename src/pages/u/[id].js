import useSWR from 'swr';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import geo from 'geopattern';
import { Box, Avatar, Flex, Image, Heading, } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import VideoGrid from '../../components/VideoGrid/Index';

const fetcher = (url) => fetch(url).then((res) => res.json());

function countViews(videos) {
  return videos.reduce((acc, cv) => {
    acc += cv.views;
    return acc;
  }, 0);
}

function UserProfile({ id }) {
  const { data: user } = useSWR(`/api/users/${id}`, fetcher);
  const { data: videos } = useSWR(`/api/users/${id}/videos?visibility=public`, fetcher);

  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <Layout>
        <Flex w='full' direction='column'>
          <Image
            w='full'
            h='300px'
            objectFit='cover'
            src={geo.generate(user?.id).toDataUri()}
          />
          <Flex p='2' justify='center' align='center'>
            <Flex direction='column' align='center'>
              <Avatar
                mt='2'
                src={user?.image}
                w='75px' h='75px'
              />
              <Heading size='lg'>{user?.name}</Heading>
            </Flex>
          </Flex>
          <Box p='2'>
            {videos && <VideoGrid videos={videos} />}
          </Box>
        </Flex>
      </Layout>
    </>
  );
}

export default function UserProfileIndex() {
  const router = useRouter();
  const { id } = router.query;
  if (!id) return <div />;
  return <UserProfile id={id} />;
}
