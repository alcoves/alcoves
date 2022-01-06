import VideoModal from './VideoModal'
import duration from '../../utils/duration'
import {
  Box,
  useDisclosure,
  Flex,
  Text,
  Editable,
  EditablePreview,
  EditableInput,
  Avatar,
  Spinner,
  Progress,
} from '@chakra-ui/react'
import { Video } from '../../types/types'
import { getThumanailUrl } from '../../utils/urls'

export default function VideoItem({ v }: { v: Video }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <VideoModal isOpen={isOpen} onClose={onClose} v={v} />
      <Box
        id={v.id}
        key={v.id}
        cursor='pointer'
        direction='column'
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
          zIndex={1}
          direction='column'
          position='absolute'
          justify='space-between'
          _hover={{ bg: 'rgba(0,0,0,.1)' }}
        >
          <Flex justify='space-between'>
            {v?.user?.username && (
              <Box>
                <Avatar name={v.user.username} size='xs' src={v.user.image} />
              </Box>
            )}
            <Flex align='center' bg='rgba(0,0,0,.6)' px='1' py='.5' rounded='md'>
              <Text fontSize='.8rem' fontWeight='700'>
                {duration(v.length)}
              </Text>
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
    </>
  )
}
