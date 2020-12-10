import { useContext, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { Heading, Pane, Table, Spinner, } from 'evergreen-ui';
import moment from 'moment';
import Layout from '../../components/Layout';
import { Context, } from '../../utils/store';
import { useApiLazy, } from '../../utils/api';

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
              <Table.TextHeaderCell>
                Title
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                Created At
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                Visibility
              </Table.TextHeaderCell>
              <Table.TextHeaderCell>
                Views
              </Table.TextHeaderCell>
            </Table.Head>
            <Table.Body height='100%'>
              {data.map(v => (
                <Table.Row key={v.id} isSelectable onSelect={() => router.push(`/studio/${v.id}`)}>
                  <Table.TextCell>{v.title}</Table.TextCell>
                  <Table.TextCell>{moment(v.createdAt).fromNow()}</Table.TextCell>
                  <Table.TextCell>
                    {v.visibility}
                  </Table.TextCell>
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