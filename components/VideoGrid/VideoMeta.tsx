import moment from 'moment'
import Link from 'next/link'
import DeleteVideo from './DeleteVideo'
import abbreviateNumber from '../../utils/abbreviateNumber'
import { Video } from '../../types'
import { useSession } from 'next-auth/react'
import {
  Input,
  Flex,
  Text,
  Fade,
  Avatar,
  Heading,
  HStack,
  VStack,
  Spinner,
  InputGroup,
  InputRightElement,
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { fetchMutate } from '../../utils/fetcher'
import { getApiUrl } from '../../utils/api'
import MoveVideo from './MoveVideo'
import { useSWRConfig } from 'swr'

let timer: NodeJS.Timeout

export default function VideoMeta(props: { v: Video }): JSX.Element {
  const { v } = props
  const { mutate } = useSWRConfig()
  const { data: session } = useSession()
  const [saving, setSaving] = useState(false)
  const createdAt = moment(v.createdAt).fromNow()
  const metadata = `${abbreviateNumber(v.views)} views - ${createdAt}`

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    clearTimeout(timer)
    timer = setTimeout(async () => {
      setSaving(true)
      await fetchMutate({
        method: 'patch',
        data: { title: e.target.value },
        url: `${getApiUrl()}/videos/${v._id}`,
      })
      setSaving(false)
      mutate(`${getApiUrl()}/pods/${v.pod}/videos`)
    }, 750)
  }

  return (
    <VStack spacing={2} mt='2' align='start'>
      {v?.owner?._id === session?.id ? (
        <InputGroup>
          <Input
            w='100%'
            size='sm'
            rounded='md'
            variant='filled'
            defaultValue={v.title}
            onChange={handleTitleChange}
          />
          <InputRightElement color='green.500'>
            <Fade in={saving}>
              <Spinner size='xs' />
            </Fade>
          </InputRightElement>
        </InputGroup>
      ) : (
        <Link passHref href={`/v/${v._id}`}>
          <Heading noOfLines={2} cursor='pointer' size='sm'>
            {v.title}
          </Heading>
        </Link>
      )}
      <HStack spacing='12px' justify='space-between' w='100%'>
        <Flex>
          <Link passHref href={`/u/${v.owner._id}`}>
            <Avatar
              h='35px'
              w='35px'
              cursor='pointer'
              src={v?.owner?.image}
              name={v?.owner?.name[0]}
            />
          </Link>
          <Flex pl='2' direction='column' overflow='hidden'>
            <Link passHref href={`/u/${v.owner._id}`}>
              <Text cursor='pointer' fontSize='xs'>
                {v?.owner?.name}
              </Text>
            </Link>
            <Text fontSize='xs'>{metadata}</Text>
          </Flex>
        </Flex>
        {v.owner._id === session?.id && (
          <HStack spacing={1}>
            <DeleteVideo podId={v.pod} id={v._id} />
            <MoveVideo podId={v.pod} id={v._id} />
          </HStack>
        )}
      </HStack>
    </VStack>
  )
}
