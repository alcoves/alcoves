import { Box, Grid, GridItem, Text, Avatar, Heading, } from '@chakra-ui/react';
import useSWR from 'swr';
import moment from 'moment';
import abbreviateNumber from '../../utils/abbreviateNumber';
import Link from 'next/link';

const fetcher = (url) => fetch(url).then((res) => res.json());

export default function VideoMeta({ v }) {
  const { data: user } = useSWR(v.userId ? `/api/users/${v.userId}` : false, fetcher);
  const createdAt = moment(v.createdAt).fromNow();
  const metadata = `${abbreviateNumber(v.views)} views - ${createdAt}`;

  return (
    <Grid
      templateRows='repeat(2, 40px)'
      templateColumns='repeat(5, 1fr)'
      gap={1}
    >
      <GridItem rowSpan={2} colSpan={1}>
        <Link href={`/u/${v.userId}`}>
          <Avatar
            size='md'
            cursor='pointer'
            src={user?.image}
          />
        </Link>
      </GridItem>
      <GridItem colSpan={4}>
        <Link href={`/v/${v.videoId}`}>
          <Heading cursor='pointer' size='sm'>{v.title}</Heading>
        </Link>
       
      </GridItem>
      <GridItem colSpan={4} rowSpan={1}>
        <Box>
          <Link href={`/u/${v.userId}`}>
            <Text cursor='pointer' fontSize='xs'>{user?.name}</Text>
          </Link>
          <Text fontSize='xs'>{metadata}</Text>
        </Box>
      </GridItem>
    </Grid>
  );
}