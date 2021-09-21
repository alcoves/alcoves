import { Flex, Text, Avatar, Heading, HStack, IconButton } from '@chakra-ui/react'
import moment from 'moment'
import abbreviateNumber from '../../utils/abbreviateNumber'
import Link from 'next/link'
import { IoTrash } from 'react-icons/io5'
import { fetchMutate } from '../../utils/fetcher'
import { getApiUrl } from '../../utils/api'
import { Video } from '../../types'

export default function VideoMeta(props: { v: Video }): JSX.Element {
  const { v } = props
  const createdAt = moment(v.createdAt).fromNow()
  const metadata = `${abbreviateNumber(v.views)} views - ${createdAt}`

  async function handleDelete() {
    try {
      await fetchMutate({
        method: 'delete',
        url: `${getApiUrl()}/pods/${v.pod}/videos/${v._id}`,
      })
    } catch (error) {
      console.error(error)
    }
  }

  return (
    <HStack spacing='12px' py='2' align='start' minH='75px'>
      <IconButton aria-label='delete-video' onClick={handleDelete} size='sm' icon={<IoTrash />} />
      {v?.user && (
        <Flex>
          <Link passHref href={`/u/${v.owner._id}`}>
            <Avatar
              h='40px'
              w='40px'
              cursor='pointer'
              src={v?.user?.image}
              name={v?.user?.name[0]}
            />
          </Link>
        </Flex>
      )}
      <Flex direction='column' overflow='hidden'>
        <Link passHref href={`/v/${v._id}`}>
          <Heading noOfLines={2} cursor='pointer' size='sm'>
            {v.title}
          </Heading>
        </Link>
        <Link passHref href={`/u/${v.owner._id}`}>
          <Text cursor='pointer' fontSize='xs'>
            {v?.user?.name}
          </Text>
        </Link>
        <Text fontSize='xs'>{metadata}</Text>
      </Flex>
    </HStack>
  )
}
