import useSWR from 'swr';
import Head from 'next/head';
import { useRouter, } from 'next/router';
import { Box, Avatar, Flex, Heading, } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import VideoGrid from '../../components/VideoGrid/Index';

const fetcher = (url) => fetch(url).then((res) => res.json());

function UserProfile({ id }) {
  const { data: user } = useSWR(`/api/users/${id}`, fetcher);
  const { data: videos } = useSWR(`/api/users/${id}/videos?visibility=public`, fetcher);

  return (
    <>
      <Head>
        <title>bken.io</title>
      </Head>
      <Layout>
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
