import useSWR from 'swr';
import { useRouter, } from 'next/router';
import { Flex, Avatar, Heading, } from '@chakra-ui/react';

const fetcher = (url) => fetch(url).then((res) => res.json());

function VideoPageUserCard({ id }) {
  const router = useRouter();
  const { data } = useSWR(id ? `/api/users/${id}` : false, fetcher);

  if (data) {
    return (
      <Flex pt='4'>
        <Avatar
          size='md'
          src={data.image}
          cursor='pointer'
          onClick={() => router.push(`/u/${id}`)}
        />
        <Heading
          pl='4'
          size='sm'
          cursor='pointer'
          onClick={() => router.push(`/u/${id}`)}
        >
          {data.name}
        </Heading>
      </Flex>
    );
  }

  return <div />; 
}

export default VideoPageUserCard;