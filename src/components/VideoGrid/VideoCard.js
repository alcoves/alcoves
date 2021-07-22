import { Box, Text, Skeleton, } from '@chakra-ui/react';
import Link from 'next/link';
import videoDuration from '../../utils/videoDuration';
import VideoMeta from './VideoMeta';

export default function VideoCard({ v }) {
  return (
    <Skeleton isLoaded={Boolean(v.id)} maxW='400px'>
      <Link href={`/v/${v.id}`}>
        <Box
          borderRadius='md'
          boxShadow='inner'
          w='100%' h='200px'
          bgSize='cover' bgColor='black'
          bgImage={`url("${v.thumbnail}")`}
          cursor='pointer' position='relative'
          bgPosition='center' bgRepeat='no-repeat'
        >
          <Text
            px='1'
            right={1}
            bottom={1}
            align='center'
            justify='center'
            borderRadius='md'
            position='absolute'
            bg='rgba(10, 10, 10, .4)'
            color='gray.100' fontSize='xs' fontWeight='bold'>
            {videoDuration(v.duration)}
          </Text>
        </Box>
      </Link>
      <VideoMeta v={v}/>
    </Skeleton>
  );
}