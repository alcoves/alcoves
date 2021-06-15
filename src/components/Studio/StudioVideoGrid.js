import { SimpleGrid, } from '@chakra-ui/react';
import StudioVideo from './StudioVideo';

export default function StudioVideoGrid({ videos = [] }) {
  if (videos.length === 0) {
    for (let i = 0; i < 8; i++) {
      videos.push({});
    }
  }
  return ( 
    <SimpleGrid columns={[1, 1, 3, 3, 4]} spacing='10px'>
      {videos.map(v => <StudioVideo key={v.videoId} v={v}/>)}
    </SimpleGrid>
  );  
}