import VideoMeta from './VideoMeta'
import videoDuration from '../../utils/videoDuration'
import { Video } from '../../types'
import { Spacer, Flex, Box, Text, Skeleton, Spinner } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function VideoCard(props: { v: Video }): JSX.Element {
  const router = useRouter()
  const { v } = props
  const thumbnailUrl = `https://cdn.bken.io/v/${v._id}/thumbnail.jpg`

  return (
    <Skeleton isLoaded={Boolean(v._id)} maxW='400px'>
      {/* <Link passHref href={}> */}
      <Box
        borderRadius='md'
        cursor='pointer'
        w='100%'
        h='200px'
        bgSize='cover'
        bgColor='black'
        bgPosition='center'
        bgRepeat='no-repeat'
        bgImage={`url("${thumbnailUrl}")`}
        onClick={() => router.push(`/v/${v._id}`)}
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
      <VideoMeta v={v} />
      {/* </Link> */}
    </Skeleton>
  )
}
