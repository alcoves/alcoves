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
  Button,
  Flex,
  Box,
} from '@chakra-ui/react';
import moment from 'moment';
import { useSession, } from 'next-auth/client';
import axios from 'axios';
import Layout from '../components/Layout';
import isAdmin from '../utils/isAdmin';

async function reprocess({ currentTarget }) {
  const { id } = currentTarget;
  console.log('Reprocessing', id);

  const res = await axios.post('https://bk-det1.bken.dev/tidal/jobs/transcode', {
    videoId: id,
    webhookUrl: `https://bken.io/api/videos/${id}`,
    rcloneDestinationUri: `wasabi:cdn.bken.io/v/${id}/mpd`,
    rcloneSourceUri: `wasabi:cdn.bken.io/v/${id}/${id}.mp4`,
  });

  const res2 = await axios.post('https://bk-det1.bken.dev/tidal/jobs/thumbnail', {
    videoId: id,
    webhookUrl: `https://bken.io/api/videos/${id}`,
    rcloneDestinationUri: `wasabi:cdn.bken.io/v/${id}/thumb.webp`,
    rcloneSourceUri: `wasabi:cdn.bken.io/v/${id}/${id}.mp4`,
  });

  console.log('reprocesing res', res);
}

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
                  <Box>{v.duration}</Box>
                  <Box>{v.mpdLink}</Box>
                </Td>
                <Td><Link href={`/v/${v.videoId}`}>{v.videoId}</Link></Td>
                <Td>{v.userId}</Td>
                <Td>
                  <Flex direction='column'>
                    {v.status}
                    <Button id={v.videoId} onClick={reprocess} w='100px' my='2' size='xs'>Reprocess</Button>
                  </Flex>
                </Td>
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