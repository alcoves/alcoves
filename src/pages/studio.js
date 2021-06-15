import useSWR from 'swr';
import { useSession, } from 'next-auth/client';
import { Box, Progress, Container, Heading, } from '@chakra-ui/react';
import Layout from '../components/Layout';
import Uploader from '../components/Uploader';
import StudioVideoGrid from '../components/Studio/StudioVideoGrid';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function studio() {
  const [ session, sessionLoading ] = useSession();
  const { data: videos } = useSWR(session ?
    `/api/users/${session.id}/videos` :
    null, fetcher, { refreshInterval: 1000 }
  );
  
  if (!sessionLoading && !session) {
    return (
      <Layout>
        <Container textAlign='center' pt='1rem'>
          <Heading size='lg'>
            You must be authenticated
          </Heading>
        </Container>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p='4'>
        <Box pb='4'><Uploader/></Box>
        <StudioVideoGrid videos={videos}/>
      </Box>
    </Layout>
  );
}