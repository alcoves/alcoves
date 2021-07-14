import { SimpleGrid,  } from '@chakra-ui/react';
import VideoCard from './VideoCard';

export default function VideoGrid({ videos = [] }) {
  if (videos.length === 0) {
    for (let i = 0; i < 30; i++) {
      videos.push({});
    }
  }
  return (
    <SimpleGrid minChildWidth='350px' spacing='10px'>
      {videos.map(v => <VideoCard key={v.videoId} v={v} />)}
    </SimpleGrid>
  );
}