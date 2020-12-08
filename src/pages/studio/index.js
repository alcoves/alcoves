import { useContext, useEffect, } from 'react';
import { Heading, Pane, Button, Spinner, } from 'evergreen-ui';
import Link from 'next/link';
import Layout from '../../components/Layout';
import { Context, } from '../../utils/store';
import { useApiLazy, } from '../../utils/api';
import Icon from '../../components/Icon';

export default function studio() {
  const [getVideos, { data, loading }] = useApiLazy();
  const { user, authenticated } = useContext(Context);

  useEffect(() => {
    if (user && user.id) {
      getVideos({ url: `/videos?userId=${user.id}&visibility=all` });
    }
  }, [user]);

  if (loading) {
    return (
      <Layout>
        <Spinner />
      </Layout>
    );
  }

  if (data) {
    return (
      <Layout>
        <Pane display='flex' justifyContent='center' width='100%'>
          <Pane
            width='800px'
            display='flex'
            padding={20}
            flexDirection='column'
            alignItems='flex-start'
            justifyContent='center'
          >
            {data.map((v) => (
              <Pane
                key={v.id}
                display='flex'
                marginTop={10}
                marginBottom={10}
              >
                <img
                  alt='thumb'
                  height='100px'
                  src={v.thumbnail}
                  style={{ borderRadius: '3px'}}
                />
                <div style={{ paddingLeft: 10 }}>
                  <Pane display='flex' alignItems='center'>
                    <Icon
                      width={18}
                      height={18}
                      color={v.visibility === 'public' ? 'green' : 'grey'}
                      name={v.visibility === 'public' ? 'globe' : 'link-2'}
                    />
                    <Heading
                      size={400}
                      width='300px'
                      overflow='hidden'
                      whiteSpace='nowrap'
                      textOverflow='ellipsis'
                    >
                      {v.title}
                    </Heading>
                  </Pane>
                  <Link href={`/studio/${v.id}`} passHref>
                    <Button>
                      Edit
                    </Button>
                  </Link>
                </div>
              </Pane>
            ))}
          </Pane>
        </Pane>
      </Layout>
    );
  }

  if (!authenticated) {
    return (
      <Layout>
        <Pane display='flex' justifyContent='center'>
          <Heading size={300}>
            You must be authenticated
          </Heading>
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