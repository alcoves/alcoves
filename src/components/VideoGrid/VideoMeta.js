import { Box, Grid, GridItem, Text, Avatar, Heading, } from '@chakra-ui/react';
import useSWR from 'swr';
import moment from 'moment';
import { useRouter, } from 'next/router';
import abbreviateNumber from '../../utils/abbreviateNumber';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function VideoMeta({ v }) {
  const { data: user } = useSWR(v.userId ? `/api/users/${v.userId}` : false, fetcher);
  const router = useRouter();

  const createdAt = moment(v.createdAt).fromNow();
  const metadata = `${abbreviateNumber(v.views)} views - ${createdAt}`;

  return (
    <Grid
      templateRows='repeat(2, 40px)'
      templateColumns='repeat(5, 1fr)'
      gap={1}
    >
      <GridItem rowSpan={2} colSpan={1}>
        <Avatar
          size='md'
          src={user?.image}
          cursor='pointer'
          onClick={() => router.push(`/u/${v.userId}`)}
        />
      </GridItem>
      <GridItem colSpan={4}>
        <Heading onClick={() => router.push(`/v/${v.videoId}`)} cursor='pointer' size='sm'>{v.title}</Heading>
      </GridItem>
      <GridItem colSpan={4} rowSpan={1}>
        <Box>
          <Text cursor='pointer' fontSize='xs' onClick={() => router.push(`/u/${v.userId}`)} >{user?.name}</Text>
          <Text fontSize='xs'>{metadata}</Text>
        </Box>
      </GridItem>
    </Grid>
  );
}