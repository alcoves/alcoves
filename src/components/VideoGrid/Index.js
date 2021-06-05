import { SimpleGrid,  } from '@chakra-ui/react';
import VideoCard from './VideoCard';

export default function VideoGrid({ videos }) {
  return (
    <SimpleGrid columns={[1, 1, 2, 2, 3, 4]} spacing='10px'>
      {videos.map(v => <VideoCard key={v.videoId} v={v} />)}
    </SimpleGrid>
  );
}