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
  HStack,
  Text,
} from '@chakra-ui/react';
import moment from 'moment';
import { useSession, } from 'next-auth/client';
import axios from 'axios';
import Layout from '../components/Layout';
import videoDuration from '../utils/videoDuration';

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
                <Box
                  rounded='md'
                  h='50px'
                  position='relative'
                  bgImage={v.thumbnail}
                  bgSize='cover'
                  bgColor='black'
                  bgPosition='center'
                  bgRepeat='no-repeat'
                >
                  <Flex
                    position='absolute'
                    right='0'
                    bottom='0'
                    justify='center'
                    align='center'
                    bg='rgba(10, 10, 10, .4)'
                    borderRadius='md'
                    px='1'
                  >
                    <Text color='gray.100' fontSize='xs' fontWeight='bold'>
                      {videoDuration(v.duration)}
                    </Text>
                  </Flex>
                </Box>
              </Td>
              <Td><Link href={`/v/${v.id}`}>{v.id}</Link></Td>
              <Td>
                {v.user.id}
                {v.user.name}
                {v.user.image}
              </Td>
              <Td>
                <HStack direction='row' align='center'>
                  <Flex>
                    {v.status}
                  </Flex>
                  <Button id={v.id} onClick={() => reprocessVideo(v.id)} my='2' size='xs'>
                    Reprocess Video
                  </Button>
                  <Button id={v.id} onClick={() => reprocessThumbnail(v.id)} my='2' size='xs'>
                    Reprocess Thumbnail
                  </Button>
                </HStack>
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