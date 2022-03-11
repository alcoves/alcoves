import {
  Box,
  Button,
  Editable,
  EditableInput,
  EditablePreview,
  Flex,
  Link,
  Progress,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'
import { IoLinkSharp } from 'react-icons/io5'

import useLazyRequest from '../../hooks/useLazyRequest'
import { Video } from '../../types/types'
import duration from '../../utils/duration'
import { getAPIUrl, getPublicUrl, getThumanailUrl } from '../../utils/urls'

import DeleteVideo from './DeleteVideo'
import VideoModal from './VideoModal'

const AUTOSAVE_INTERVAL = 1000

export default function VideoItem({ v }: { v: Video }) {
  const shareUrl = getPublicUrl(v.id)
  const [patchVideo] = useLazyRequest()
  const [title, setTitle] = useState(v.title)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isHovering, setIsHovering] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title !== v.title) {
        patchVideo({
          method: 'PATCH',
          data: { title },
          url: `${getAPIUrl()}/videos/${v.id}`,
        })
      }
    }, AUTOSAVE_INTERVAL)
    return () => {
      clearTimeout(timer)
    }
  }, [title])

  function copyLinkToClipboard() {
    navigator.clipboard.writeText(shareUrl).then(
      function () {
        /* clipboard successfully set */
      },
      function () {
        /* clipboard write failed */
      }
    )
  }

  return (
    <Box rounded='md' id={v.id} key={v.id}>
      <VideoModal isOpen={isOpen} onClose={onClose} v={v} />
      <Box
        cursor='pointer'
        position='relative'
        onClick={e => {
          if (!e.shiftKey && !e.ctrlKey) {
            onOpen()
          }
        }}
      >
        <Flex
          p='1'
          w='100%'
          h='100%'
          direction='column'
          position='absolute'
          justify='space-between'
          _hover={{ bg: 'rgba(0,0,0,.1)' }}
          onMouseOver={() => setIsHovering(true)}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
        >
          <Flex justify='space-between'>
            <Flex align='center' bg='rgba(0,0,0,.6)' px='1' py='.5' rounded='md'>
              <Text fontSize='.8rem' fontWeight='800' color='#ffffff'>
                {duration(v.length)}
              </Text>
            </Flex>
            <Flex
              visibility={isHovering ? 'visible' : 'hidden'}
              onClick={e => {
                e.stopPropagation()
              }}
            >
              <DeleteVideo videoId={v.id} />
            </Flex>
          </Flex>
          <Flex align='center' direction='column'>
            {v.status !== 'READY' && (
              <>
                <Spinner />
                <Progress mt='2' h='4px' w='100px' value={v.progress} />
                <Text fontWeight='700'>{v.status}</Text>
              </>
            )}
            {v.status === 'ERROR' && (
              <Text fontWeight='700' color='red.500'>
                {v.status}
              </Text>
            )}
          </Flex>
          <Flex />
        </Flex>
        <Box
          w='100%'
          h='200px'
          rounded='md'
          backgroundSize='cover'
          backgroundColor='black'
          backgroundPosition='center'
          backgroundRepeat='no-repeat'
          backgroundImage={v.progress > 25 ? getThumanailUrl(v.cdnUrl) : undefined}
        />
      </Box>
      <Box pt='1' pb='4'>
        <Editable
          fontWeight={600}
          defaultValue={title}
          onChange={value => {
            setTitle(value)
          }}
        >
          <EditablePreview pl='2' />
          <EditableInput pl='2' />
        </Editable>
        <Flex justify='space-between' align='center'>
          <Link href={shareUrl} fontSize='.9rem' pl='2' isTruncated>
            {shareUrl}
          </Link>
          <Button
            ml='2'
            size='xs'
            onClick={copyLinkToClipboard}
            leftIcon={<IoLinkSharp size='14px' />}
          >
            Copy
          </Button>
        </Flex>
      </Box>
    </Box>
  )
}
