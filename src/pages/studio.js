import useSWR from 'swr';
import { useSession, } from 'next-auth/client';
import { Box, Button, Flex, SimpleGrid, useMediaQuery, } from '@chakra-ui/react';
import { useRouter, } from 'next/router';
import { useEffect, useState, } from 'react';
import Layout from '../components/Layout';
import StudioVideoCard from '../components/Studio/StudioVideoCard';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function studio() {
  const router = useRouter();
  const [ session, sessionLoading ] = useSession();
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
  
  if (!sessionLoading && !session) {
    router.push('/login');
    return <div/>;
  }

  return (
    <Layout>
      <Box p='4'>
        <Flex mb='2' justify='end'>
          <Button isLoading={isValidating} size='sm' onClick={mutate}>Refresh</Button>
        </Flex>
        <SimpleGrid minChildWidth={[200, 400]} spacing='10px'>
          {videos.map((v, i) => <StudioVideoCard key={v?.videoId || i} v={v}/>)}
        </SimpleGrid>
      </Box>
    </Layout>
  );
}