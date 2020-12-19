import { useContext, useEffect, } from 'react';
import { useRouter, } from 'next/router';
import { Heading, Box, Table, Text, TableHeader, TableRow, TableCell, TableBody, } from 'grommet';
import moment from 'moment';
import Layout from '../../components/Layout';
import { Context, } from '../../utils/store';
import { useApiLazy, } from '../../utils/api';
import Icon from '../../components/Icon';
import Spinner from '../../components/Spinner';

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
        <Box>
          <Table>
            <TableHeader>
              <TableRow>
                <TableCell scope='col' border='bottom'>
                  Thumbnail
                </TableCell>
                <TableCell scope='col' border='bottom'>
                  Visibility
                </TableCell>
                <TableCell scope='col' border='bottom'>
                  Title
                </TableCell>
                <TableCell scope='col' border='bottom'>
                  Created
                </TableCell>
                <TableCell scope='col' border='bottom'>
                  Views
                </TableCell>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.map(v => (
                <>
                  <TableRow>
                    <TableCell scope='row'>
                      <div
                        style={{cursor: 'pointer'}}
                        onClick={() => {
                          router.push(`/studio/${v.id}`);
                        }}
                      >
                        <img height='70px' src={v.thumbnail} alt='thumb' />
                      </div>
                    
                    </TableCell>
                    <TableCell>
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
                    </TableCell>
                    <TableCell>{v.title}</TableCell>
                    <TableCell width='80px'>
                      <Text size='xsmall'>
                        {moment(v.createdAt).fromNow()}
                      </Text>
                    </TableCell>
                    <TableCell>
                      <Text size='xsmall'>
                        {v.views}
                      </Text>
                    </TableCell>
                  </TableRow>
                </>
              ))}
            </TableBody>
          </Table>
        </Box>
      </Layout>
    );
  }

  if (!authenticated) {
    return (
      <Layout>
        <Box margin='small' align='center'>
          <Heading size='xsmall'>
            You must be authenticated
          </Heading>
        </Box>
      </Layout>
    );
  }

  return (
    <Layout>
      <Box margin='small' align='center'>
        <Spinner />
      </Box>
    </Layout>
  );
}