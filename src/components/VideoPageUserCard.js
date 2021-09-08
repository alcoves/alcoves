import useSWR from 'swr'
import Link from 'next/link'
import { Flex, Avatar, Heading } from '@chakra-ui/react'
import { fetcher } from '../utils/fetcher'

function VideoPageUserCard({ id }) {
  const { data } = useSWR(id ? `/api/users/${id}` : false, fetcher)

  if (data) {
    return (
      <Flex pt='4'>
        <Link passHref href={`/u/${id}`}>
          <Avatar size='md' cursor='pointer' src={data?.image} name={data?.name[0]} />
        </Link>
        <Link passHref href={`/u/${id}`}>
          <Heading pl='4' size='sm' cursor='pointer'>
            {data?.name}
          </Heading>
        </Link>
      </Flex>
    )
  }

  return <div />
}

export default VideoPageUserCard
