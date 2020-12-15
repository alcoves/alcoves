import { useContext, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { Heading, Pane, Table, Spinner, } from 'evergreen-ui';
import moment from 'moment';
import Layout from '../../components/Layout';
import { Context, } from '../../utils/store';
import { useApiLazy, } from '../../utils/api';
import Icon from '../../components/Icon';

export default function studio() {
  const router = useRouter();
  const [getVideos, { data }] = useApiLazy();
  const { user, authenticated } = useContext(Context);

  useEffect(() => {
    if (user && user.id) {
      getVideos({ url: `/videos?userId=${user.id}&visibility=all` });
    }
  }, [user]);

  if (data) {
    return (
      <Layout>
        <Pane padding={10}>
          <Table>
            <Table.Head>
              <Table.TextHeaderCell flexBasis={120} flexShrink={0} flexGrow={0} />
              <Table.TextHeaderCell flexBasis={75} flexShrink={0} flexGrow={0}>
                Visibility
              </Table.TextHeaderCell>
              <Table.TextHeaderCell flexBasis={560} flexShrink={0} flexGrow={0}>
                Title
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                Created At
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                Views
              </Table.TextHeaderCell>
            </Table.Head>
            <Table.Body height='100%'>
              {data.map(v => (
                <Table.Row
                  key={v.id}
                  isSelectable
                  height='50px'
                  onSelect={() => router.push(`/studio/${v.id}`)}
                >
                  <Table.TextCell
                    flexBasis={120}
                    flexShrink={0}
                    flexGrow={0}
                  >
                    <img height='50px' src={v.thumbnail} alt='thumb' />
                  </Table.TextCell>
                  <Table.TextCell flexBasis={75} flexShrink={0} flexGrow={0}>
                    {v.visibility === 'public' ? (
                      <Icon
                        width='20px'
                        height='20px'
                        name='globe'
                        color='green'
                      />
                    ) : (
                      <Icon
                        width='20px'
                        height='20px'
                        name='link-2'
                        color='grey'
                      />
                    )}
                  </Table.TextCell>
                  <Table.TextCell flexBasis={560} flexShrink={0} flexGrow={0}>
                    {v.title}
                  </Table.TextCell>
                  <Table.TextCell>{moment(v.createdAt).fromNow()}</Table.TextCell>
                  <Table.TextCell isNumber>
                    {v.views}
                  </Table.TextCell>
                </Table.Row>
              ))}
            </Table.Body>
          </Table>
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