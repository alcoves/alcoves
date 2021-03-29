import useSWR from 'swr';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableCaption,
  Image,
  Link,
} from '@chakra-ui/react';
import moment from 'moment';
import { useSession, } from 'next-auth/client';
import Layout from '../components/Layout';
import isAdmin from '../utils/isAdmin';

export default function Admin() {
  const { session } = useSession();
  const { data: videos } = useSWR('/api/videos?visibility=all');

  if (session?.id && !isAdmin(session.id)) {
    return (
      <Layout>
        <div>
          You must be an admin to view this page
        </div>
      </Layout>
    );
  }

  if (videos?.length) {
    return (
      <Layout>
        <Table variant='simple' size='sm'>
          <TableCaption> All Videos </TableCaption>
          <Thead>
            <Tr>
              <Th>Thumbnail</Th>
              <Th>Video ID</Th>
              <Th>User ID</Th>
              <Th>Status</Th>
              <Th isNumeric>Percent Completed</Th>
              <Th>Created At</Th>
            </Tr>
          </Thead>
          <Tbody>
            {videos.map((v) => (
              <Tr key={v.videoId}>
                <Td>
                  <Image height='50px' src={v.thumbnail} />
                </Td>
                <Td><Link href={`/v/${v.videoId}`}>{v.videoId}</Link></Td>
                <Td>{v.userId}</Td>
                <Td>{v.status}</Td>
                <Td isNumeric>{v.percentCompleted}</Td>
                <Td>{moment(v.createdAt).fromNow()}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Layout>
    );
  }

  return <Layout/>;
}