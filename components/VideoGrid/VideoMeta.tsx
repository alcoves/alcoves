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
  HStack,
  VStack,
  Spinner,
  InputGroup,
  InputRightElement,
  Button,
  useColorModeValue,
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { fetchMutate } from '../../utils/fetcher'
import { getApiUrl } from '../../utils/api'
import MoveVideo from './MoveVideo'
import { useSWRConfig } from 'swr'
import router from 'next/router'
import { IoLink } from 'react-icons/io5'

let timer: NodeJS.Timeout

export default function VideoMeta(props: { v: Video }): JSX.Element {
  const { v } = props
  const { mutate } = useSWRConfig()
  const { data: session } = useSession()
  const [saving, setSaving] = useState(false)
  const createdAt = moment(v.createdAt).fromNow()
  const metadata = `${abbreviateNumber(v.views)} views - ${createdAt}`

  const shareLink = `${window?.location?.href?.split('/pods')[0]}/v/${v._id}`
  const isOwner = v?.owner?._id === session?.id

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
        <Text w='100%' isTruncated passHref rounded='md' fontSize='sm' p='5px 15px 5px 15px'>
          {v.title}
        </Text>
      )}
      <Flex w='100%' justify='space-between' align='center'>
        <Text
          maxW='200px'
          color={useColorModeValue('gray.800', 'gray.300')}
          fontSize='xs'
          isTruncated
          onClick={() => {
            router.push(shareLink)
          }}
        >
          {shareLink}
        </Text>
        <Button
          size='xs'
          leftIcon={<IoLink />}
          onClick={() => {
            navigator.clipboard.writeText(shareLink)
          }}
        >
          Copy Link
        </Button>
      </Flex>
      <HStack
        w='100%'
        spacing='12px'
        justify='space-between'
        color={useColorModeValue('gray.700', 'gray.300')}
      >
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
        <HStack spacing={1}>
          {isOwner && <DeleteVideo podId={v.pod} id={v._id} />}
          {isOwner && <MoveVideo podId={v.pod} id={v._id} />}
        </HStack>
      </HStack>
    </VStack>
  )
}
