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
  Spinner,
  Progress,
} from '@chakra-ui/react'
import { Video } from '../../types/types'
import { getThumanailUrl } from '../../utils/urls'
import { IoCheckbox, IoCheckboxOutline } from 'react-icons/io5'

export default function VideoItem({
  v,
  isSelected,
  handleSelect,
}: {
  v: Video
  handleSelect: any
  isSelected: boolean
}) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      rounded='md'
      id={v.id}
      key={v.id}
      border={isSelected ? 'solid teal 2px' : 'solid transparent 2px'}
    >
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
        >
          <Flex justify='space-between'>
            <Flex align='center' bg='rgba(0,0,0,.6)' px='1' py='.5' rounded='md'>
              <Text fontSize='.8rem' fontWeight='800' color='#ffffff'>
                {duration(v.length)}
              </Text>
            </Flex>
            <Flex
              onClick={e => {
                e.stopPropagation()
                handleSelect(e, v.id)
              }}
            >
              {isSelected ? (
                <IoCheckbox color='teal' size='20px' />
              ) : (
                <IoCheckboxOutline size='20px' />
              )}
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
