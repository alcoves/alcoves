import { Box, Flex , Text, Spacer,  Skeleton, } from '@chakra-ui/react';
import { useRouter, } from 'next/router';
import videoDuration from '../../utils/videoDuration';
import VideoMeta from './VideoMeta';

export default function VideoCard({ v }) {
  const router = useRouter();

  return (
    <Box borderWidth='1px' borderRadius='md' overflow='hidden'>
      <Skeleton isLoaded={Boolean(v.videoId)}>
        <Box
          boxShadow='inner'
          w='100%' h='200px'
          bgSize='cover' bgColor='black'
          bgImage={`url("${v.thumbnail}")`}
          cursor='pointer' position='relative'
          bgPosition='center' bgRepeat='no-repeat'
          onClick={() => router.push(`/v/${v.videoId}`)}
        >
          <Flex w='100%' h='100%' direction='column' p='2'>
            <Flex>
              <Spacer/>
            </Flex>
            <Spacer/>
            <Flex align='center' direction='column'>
              <Spacer/>
            </Flex>
            <Spacer/>
            <Flex>
              <Spacer/>
              <Flex bg='rgba(10, 10, 10, .4)' borderRadius='md' px='1' justify='center' align='center'>
                <Text color='gray.100' fontSize='xs' fontWeight='bold'>{videoDuration(v.duration)}</Text>
              </Flex>
            </Flex>
          </Flex>        
        </Box>
        <Box p='2' bg='transparent' w='100%'>
          <VideoMeta v={v}/>
        </Box>
      </Skeleton>
    </Box>
  );
}