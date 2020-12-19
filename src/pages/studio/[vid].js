import { Box, Button, } from 'grommet';
import { useRouter, } from 'next/router';
import { useEffect, useContext, } from 'react';
import Layout from '../../components/Layout';
import { useApiLazy, } from '../../utils/api';
import { Context, } from '../../utils/store';
import Spinner from '../../components/Spinner';

import EditTitle from '../../components/Studio/EditTitle';
import DeleteVideo from '../../components/Studio/DeleteVideo';
import ListVersions from '../../components/Studio/ListVersions';
import EditVisibility from '../../components/Studio/EditVisibility';

export default function StudioEditVideo() {
  const { authenticated, loading } = useContext(Context);
  const [getVideo, { data }] = useApiLazy();
  const router = useRouter();
  const { vid } = router.query;

  useEffect(() => {
    if (!loading && !authenticated) {
      return router.push(`/login?redirect=${router.asPath}`);
    }
    
    if (vid) {
      getVideo({ url: `/videos/${vid}` });
    }
  }, [vid]);

  if (data) {
    return (
      <Layout>
        <Box
          width='100%'
          align='center'
          justify='center'
          style={{ paddingTop: '30px' }}
        >
          <Box
            pad='small'
            width='700px'
          >
            <Box margin='xsmall'>
              <EditTitle id={data.id} title={data.title} />
            </Box>
            <Box margin='xsmall'>
              <img
                width='100%'
                alt='thumbnail'
                src={data.thumbnail}
                style={{ borderRadius:'4px' }}
              />
              <Box paddingTop={10} paddingBottom={10}>
                <EditVisibility id={data.id} visibility={data.visibility} />
              </Box>
            </Box>
            <Box margin='xsmall'>
              <ListVersions id={data.id} />
            </Box>
            <Box margin='xsmall' direction='row' justify='between'>
              <DeleteVideo id={data.id} />
              <Button primary onClick={() => router.push(`/v/${vid}`)} label='View' />
            </Box>
          </Box>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box align='center' pad='small'>
        <Spinner />
      </Box>
    </Layout>
  );
}