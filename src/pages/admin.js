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
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { useSession, } from 'next-auth/client';
import axios from 'axios';
import Layout from '../components/Layout';

async function reprocessThumbnail(id) {
  await axios.post('https://bk-det1.bken.dev/tidal/jobs/thumbnail', {
    videoId: id,
    webhookUrl: `https://bken.io/api/videos/${id}`,
    rcloneSourceUri: `wasabi:cdn.bken.io/v/${id}/original`,
    rcloneDestinationUri: `wasabi:cdn.bken.io/v/${id}/thumb.webp`,
  });
}

async function reprocessVideo(id) {
  await axios.post('https://bk-det1.bken.dev/tidal/jobs/transcode', {
    videoId: id,
    webhookUrl: `https://bken.io/api/videos/${id}`,
    rcloneDestinationUri: `wasabi:cdn.bken.io/v/${id}/pkg`,
    rcloneSourceUri: `wasabi:cdn.bken.io/v/${id}/original`,
  });
}

async function reprocessAllVideos(videos) {
  await Promise.all(videos.map(({ id }) => reprocessVideo(id)));
}

async function reprocessAllThumbnails(videos) {
  await Promise.all(videos.map(({ id }) => reprocessThumbnail(id)));
}

export default function Admin() {
  const [session, loading] = useSession();
  const { data: videos = [] } = useSWR('/api/videos?visibility=all');

  if (loading) return null;
  if ((!loading && !session) || !session?.user?.isAdmin) {
    return (
      <Layout>
        <Text>
          You must be an admin to view this page
        </Text>
      </Layout>
    );
  }

  return (
    <Layout>
      <Button onClick={() => reprocessAllVideos(videos)} my='4' ml='2' size='xs'>
        Reprocess All Videos
      </Button>
      <Button onClick={() => reprocessAllThumbnails(videos)} my='4' ml='2' size='xs'>
        Reprocess All Thumbnails
      </Button>
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
            <Tr key={v.id}>
              <Td>
                <Image height='50px' src={v.thumbnail} alt='image'/>
                <Box>{v.duration}</Box>
                <Box>{v.mpdLink}</Box>
              </Td>
              <Td><Link href={`/v/${v.id}`}>{v.id}</Link></Td>
              <Td>{v.userId}</Td>
              <Td>
                <Flex direction='column'>
                  {v.status}
                  <Button id={v.id} onClick={() => reprocessVideo(v.id)} my='2' size='xs'>
                    Reprocess Video
                  </Button>
                  <Button id={v.id} onClick={() => reprocessThumbnail(v.id)} my='2' size='xs'>
                    Reprocess Thumbnail
                  </Button>
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