import { Flex, Text, Avatar, Heading, HStack } from '@chakra-ui/react'
import moment from 'moment'
import abbreviateNumber from '../../utils/abbreviateNumber'
import Link from 'next/link'
import { Video } from '../../types'
import DeleteVideo from './DeleteVideo'

export default function VideoMeta(props: { v: Video }): JSX.Element {
  const { v } = props
  const createdAt = moment(v.createdAt).fromNow()
  const metadata = `${abbreviateNumber(v.views)} views - ${createdAt}`

  return (
    <HStack spacing='12px' py='2' align='start' minH='75px'>
      {v?.owner && (
        <Flex>
          <Link passHref href={`/u/${v.owner._id}`}>
            <Avatar
              h='40px'
              w='40px'
              cursor='pointer'
              src={v?.owner?.image}
              name={v?.owner?.name[0]}
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
            {v?.owner?.name}
          </Text>
        </Link>
        <Text fontSize='xs'>{metadata}</Text>
      </Flex>
      <DeleteVideo id={v._id} />
    </HStack>
  )
}
