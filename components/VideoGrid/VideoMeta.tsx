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
  Box,
  HStack,
  VStack,
  Spinner,
  InputGroup,
  InputRightElement,
  Button,
} from '@chakra-ui/react'
import { ChangeEvent, useState } from 'react'
import { fetchMutate } from '../../utils/fetcher'
import { getApiUrl } from '../../utils/api'
import MoveVideo from './MoveVideo'
import { useSWRConfig } from 'swr'
import router from 'next/router'

let timer: NodeJS.Timeout

export default function VideoMeta(props: { v: Video }): JSX.Element {
  const { v } = props
  const { mutate } = useSWRConfig()
  const { data: session } = useSession()
  const [saving, setSaving] = useState(false)
  const createdAt = moment(v.createdAt).fromNow()
  const metadata = `${abbreviateNumber(v.views)} views - ${createdAt}`

  const shareLink = `${window?.location?.href?.split('/pods')[0]}/v/${v._id}`

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
        <Box w='100%' passHref rounded='md' fontSize='sm' p='5px 15px 5px 15px'>
          {v.title}
        </Box>
      )}
      <Flex w='100%' justify='end'>
        <Button
          size='xs'
          onClick={() => {
            router.push(shareLink)
          }}
        >
          Link
        </Button>
      </Flex>
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
