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
} from '@chakra-ui/react'
import duration from '../../utils/duration'
import MediaItemModal from './MediaItemModal'

export default function MediaItem({ m }: any) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <>
      <MediaItemModal isOpen={isOpen} onClose={onClose} m={m} />
      <Box
        id={m.id}
        key={m.id}
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
            <Box>
              <Avatar name={m.user.username} size='xs' src={m.user.image} />
            </Box>
            <Flex align='center' bg='rgba(0,0,0,.6)' px='1' py='.5' rounded='md'>
              <Text fontSize='.8rem' fontWeight='700'>
                {duration(m.duration)}
              </Text>
            </Flex>
          </Flex>
          <Flex align='center' direction='column'>
            {m.status === 'OPTIMIZING' && (
              <>
                <Spinner />
                <Text fontWeight='700'>{m.status}</Text>
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
          backgroundImage={m.thumbnailUrl || m.url}
        />
      </Box>
      <Box pt='1' pb='4'>
        <Editable
          defaultValue={m.title}
          onSubmit={value => {
            if (value !== m.title) {
              // Edit the title
              console.log('submit', value)
            }
          }}
        >
          <EditablePreview pl='2' />
          <EditableInput pl='2' />
        </Editable>
        {/* <HStack>
          {['1', '2', '3'].map(size => (
            <Tag size='sm' key={size} variant='solid' colorScheme='teal'>
              <TagLabel>Green</TagLabel>
              <TagCloseButton />
            </Tag>
          ))}
        </HStack> */}
      </Box>
    </>
  )
}
