import { useSession, } from 'next-auth/client';
import useSWR from 'swr';
import { CircularProgress, } from '@chakra-ui/react';
import Layout from '../../components/Layout';
import Uploader from '../../components/Uploader';
import StudioVideoGrid from '../../components/Studio/StudioVideoGrid';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function studio() {
  const [ session, loading ] = useSession();
  const { data } = useSWR(session ? `/api/users/${session.id}/videos` : null, fetcher, { refreshInterval: 1000 });

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

  if (data && data.length) {
    return (
      <Layout>
        <Uploader/>
        <StudioVideoGrid videos={data}/>
      </Layout>
    );
  }

  return <Layout/>;
}