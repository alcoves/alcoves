import useSWR from 'swr';
import { useSession, } from 'next-auth/client';
import { Box, Button, Flex, SimpleGrid, } from '@chakra-ui/react';
import { useRouter, } from 'next/router';
import { useEffect, useState, } from 'react';
import Layout from '../components/Layout';
import StudioVideo from '../components/Studio/StudioVideo';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function studio() {
  const router = useRouter();
  const [ session, sessionLoading ] = useSession();
  const [videos, setVideos] = useState(new Array(8));
  const { data, mutate, isValidating } = useSWR(session ?
    `/api/users/${session.id}/videos` :
    null, fetcher
  );

  useEffect(() => {
    if (data?.length) {
      setVideos(data);
    }
  }, [data]);
  
  if (!session || (!sessionLoading && !session)) {
    router.push('/login');
  }

  return (
    <Layout>
      <Box p='4'>
        <Flex mb='2' justify='end'>
          <Button isLoading={isValidating} size='sm' onClick={mutate}>Refresh</Button>
        </Flex>
        <SimpleGrid columns={[1, 1, 3, 3, 4]} spacing='10px'>
          {videos.map((v, i) => <StudioVideo key={v?.videoId || i} v={v} refetch={mutate}/>)}
        </SimpleGrid>
      </Box>
    </Layout>
  );
}