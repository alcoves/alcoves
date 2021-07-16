import { Flex, Text, Avatar, Heading, HStack, } from '@chakra-ui/react';
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
    <HStack spacing='12px' py='2' align='start' minH='75px'>
      <Flex>
        <Link href={`/u/${v.userId}`}>
          <Avatar
            h='40px'
            w='40px'
            cursor='pointer'
            src={user?.image}
          />
        </Link>
      </Flex>
      <Flex direction='column' overflow='hidden'>
        <Link href={`/v/${v.videoId}`}>
          <Heading noOfLines={2} cursor='pointer' size='sm'>
            {v.title}
          </Heading>
        </Link>
        <Link href={`/u/${v.userId}`}>
          <Text cursor='pointer' fontSize='xs'>{user?.name}</Text>
        </Link>
        <Text fontSize='xs'>{metadata}</Text>
      </Flex>
    </HStack>
  );
}