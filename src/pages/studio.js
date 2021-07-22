import useSWR from 'swr';
import { useSession, } from 'next-auth/client';
import { Box, Button, Flex, SimpleGrid, } from '@chakra-ui/react';
import { useRouter, } from 'next/router';
import { useEffect, useState, } from 'react';
import Layout from '../components/Layout';
import StudioVideoCard from '../components/Studio/StudioVideoCard';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function studio() {
  const router = useRouter();
  const [ session, loading ] = useSession();
  const [videos, setVideos] = useState([]);

  const { data, mutate, isValidating } = useSWR(session ?
    `/api/users/${session.id}/videos` :
    null, fetcher
  );

  useEffect(() => {
    if (data?.length) {
      setVideos(data);
    }
  }, [data]);

  if (loading) return null;
  if (!loading && !session) {
    router.push('/login');
    return null;
  }

  return (
    <Layout>
      <Box p='4'>
        <Flex mb='2' justify='end'>
          <Button isLoading={isValidating} size='sm' onClick={mutate}>Refresh</Button>
        </Flex>
        <SimpleGrid minChildWidth={[200, 400]} spacing='10px'>
          {videos.map((v, i) => <StudioVideoCard key={v?.id || i} v={v}/>)}
        </SimpleGrid>
      </Box>
    </Layout>
  );
}