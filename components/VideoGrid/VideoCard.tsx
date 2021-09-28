import VideoMeta from './VideoMeta'
import videoDuration from '../../utils/videoDuration'
import { Video } from '../../types'
import { Spacer, Flex, Box, Text, Skeleton, Spinner, useDisclosure } from '@chakra-ui/react'
import WatchModal from './WatchModal'

export default function VideoCard(props: { v: Video }): JSX.Element {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const { v } = props
  const thumbnailUrl = `https://cdn.bken.io/v/${v.tidal}/thumbnail.jpg`

  return (
    <Skeleton isLoaded={Boolean(v._id)} maxW='400px'>
      <Box
        w='100%'
        h='200px'
        bgSize='cover'
        bgColor='black'
        cursor='pointer'
        onClick={onOpen}
        borderRadius='md'
        bgPosition='center'
        bgRepeat='no-repeat'
        bgImage={`url("${thumbnailUrl}")`}
      >
        <Flex w='100%' h='100%' justify='center' align='center' direction='column' p='1'>
          <Flex></Flex>
          <Spacer />
          <Flex>{v.status !== 'completed' && <Spinner color='#ffcc00' />}</Flex>
          <Spacer />
          <Flex justify='end' w='100%'>
            <Flex
              justify='center'
              align='center'
              bg='rgba(10, 10, 10, .4)'
              borderRadius='md'
              px='1'
            >
              <Text color='gray.100' fontSize='xs' fontWeight='bold'>
                {videoDuration(v.duration)}
              </Text>
            </Flex>
          </Flex>
        </Flex>
      </Box>
      <WatchModal isOpen={isOpen} onOpen={onOpen} onClose={onClose} v={v} />
      <VideoMeta v={v} />
    </Skeleton>
  )
}
