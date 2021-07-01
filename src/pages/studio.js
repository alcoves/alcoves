import useSWR from 'swr';
import { useSession, } from 'next-auth/client';
import { Box, Container, Heading, } from '@chakra-ui/react';
import { useRouter, } from 'next/router';
import Layout from '../components/Layout';
import Uploader from '../components/Uploader';
import StudioVideoGrid from '../components/Studio/StudioVideoGrid';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function studio() {
  const router = useRouter();
  const [ session, sessionLoading ] = useSession();
  const { data: videos } = useSWR(session ?
    `/api/users/${session.id}/videos` :
    null, fetcher, { refreshInterval: 2000 }
  );
  
  if (!sessionLoading && !session) {
    router.push('/login');
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