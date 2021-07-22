import { SimpleGrid,  } from '@chakra-ui/react';
import VideoCard from './VideoCard';

export default function VideoGrid({ videos = [] }) {
  if (videos.length === 0) {
    for (let i = 0; i < 30; i++) {
      videos.push({});
    }
  }
  return (
    <SimpleGrid minChildWidth={[200, 350]} spacing='10px'>
      {videos.map(v => <VideoCard key={v.id} v={v} />)}
    </SimpleGrid>
  );
}