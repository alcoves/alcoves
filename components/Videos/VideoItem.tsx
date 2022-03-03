import VideoModal from './VideoModal'
import DeleteVideo from './DeleteVideo'
import duration from '../../utils/duration'
import { useState } from 'react'
import { Video } from '../../types/types'
import { getThumanailUrl } from '../../utils/urls'
import {
  Box,
  Flex,
  Text,
  Spinner,
  Progress,
  Editable,
  EditableInput,
  useDisclosure,
  EditablePreview,
} from '@chakra-ui/react'

export default function VideoItem({ v }: { v: Video }) {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isHovering, setIsHovering] = useState(false)

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
            {v.status === 'PROCESSING' && (
              <>
                <Spinner />
                <Progress mt='2' h='4px' w='100px' value={v.progress} />
                <Text fontWeight='700'>{v.status}</Text>
              </>
            )}
            {v.status === 'ERROR' && (
              <>
                <Text fontWeight='700' color='red.500'>
                  {v.status}
                </Text>
              </>
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
          backgroundImage={getThumanailUrl(v.id, v.thumbnailFilename)}
        />
      </Box>
      <Box pt='1' pb='4'>
        <Editable
          defaultValue={v.title}
          onSubmit={value => {
            if (value !== v.title) {
              // TODO :: Edit the title
              console.log('submit', value)
            }
          }}
        >
          <EditablePreview pl='2' />
          <EditableInput pl='2' />
        </Editable>
      </Box>
    </Box>
  )
}
