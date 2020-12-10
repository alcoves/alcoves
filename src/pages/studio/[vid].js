import { Spinner, Pane, } from 'evergreen-ui';
import { useRouter, } from 'next/router';
import { useEffect, } from 'react';
import Layout from '../../components/Layout';
import { useApiLazy, } from '../../utils/api';

import EditTitle from '../../components/Studio/EditTitle';
import DeleteVideo from '../../components/Studio/DeleteVideo';
import ListVersions from '../../components/Studio/ListVersions';
import EditVisibility from '../../components/Studio/EditVisibility';

export default function StudioEditVideo() {
  const [getVideo, { data }] = useApiLazy();
  const router = useRouter();
  const { vid } = router.query;

  useEffect(() => {
    if (vid) getVideo({ url: `/videos/${vid}` });
  }, [vid]);

  if (data) {
    return (
      <Layout>
        <Pane
          width='100%'
          display='flex'
          paddingTop={30}
          alignItems='center'
          justifyContent='center'
          flexDirection='column'
        >
          <Pane
            padding={5}
            elevation={2}
            minWidth={700}
            background='tint2'
            borderRadius='4px'
          >
            <Pane margin={10}>
              <EditTitle id={data.id} title={data.title} />
            </Pane>
            <Pane margin={10} display='flex'>
              <img
                width='350px'
                alt='thumbnail'
                src={data.thumbnail}
                style={{ borderRadius:'4px' }}
              />
              <EditVisibility id={data.id} visibility={data.visibility} />
            </Pane>
            <Pane margin={10}>
              <ListVersions id={data.id} />
            </Pane>
            <Pane margin={10}>
              <DeleteVideo id={data.id} />
            </Pane>
          </Pane>
        </Pane>
      </Layout>
    );
  }

  return (
    <Layout>
      <Pane display='flex' justifyContent='center'>
        <Spinner />
      </Pane>
    </Layout>
  );
}