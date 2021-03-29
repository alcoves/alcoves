import { useSession, } from 'next-auth/client';
import useSWR from 'swr';
import { CircularProgress, Box, } from '@chakra-ui/react';
import { useEffect, useState, } from 'react';
import Layout from '../components/Layout';
import Uploader from '../components/Uploader';
import StudioVideoGrid from '../components/Studio/StudioVideoGrid';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function studio() {
  const [ session, loading ] = useSession();
  const [videos, setVideos] = useState([]);
  const { data } = useSWR(session ? `/api/users/${session.id}/videos` : null, fetcher, { refreshInterval: 1000 });

  useEffect(() => {
    setVideos(data);
  }, [data]);

  if (loading) {
    return (
      <Layout>
        <div margin='small' align='center'>
          <CircularProgress isIndeterminate />
        </div>
      </Layout>
    );
  }
  
  if (!loading && !session) {
    return (
      <Layout>
        <div margin='small' align='center'>
          <h1 size='xsmall'>
            You must be authenticated
          </h1>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box p='4'>
        <Box pb='4'><Uploader/></Box>
        {videos?.length
          ? <StudioVideoGrid videos={videos}/>
          : <CircularProgress isIndeterminate />
        }
      </Box>
    </Layout>
  );
}