import { Avatar, AvatarGroup, Box, Heading, HStack } from '@chakra-ui/react'
import useSWR from 'swr'

import { fetcher } from '../../utils/axios'
import { getAPIUrl } from '../../utils/urls'

import AddMediaToPod from './AddMediaToPod'
import DeletePod from './DeletePod'
import PodMediaGrid from './PodMediaGrid'

export default function Pod({ podId }: { podId: string }) {
  const fetchPath = `${getAPIUrl()}/pods/${podId}`
  const { data } = useSWR(fetchPath, fetcher)

  return (
    <Box p='2'>
      <Heading mt='5'>{data?.pod?.name}</Heading>
      <HStack mt='2'>
        <AddMediaToPod pod={data?.pod} refetchUri={fetchPath} />
        <DeletePod id={data?.pod?.id} />
      </HStack>
      <HStack mt='2'>
        <AvatarGroup size='sm' max={20}>
          <Avatar />
          <Avatar />
          <Avatar />
        </AvatarGroup>
      </HStack>
      <PodMediaGrid videos={data?.pod?.videos} />
    </Box>
  )
}
