import { SimpleGrid,  } from '@chakra-ui/react';
import StudioVideo from './StudioVideo';

export default function StudioVideoGrid({ videos }) {
  return ( 
    <SimpleGrid columns={[1, 1, 3, 3, 4]} spacing='10px'>
      {videos.map(v => <StudioVideo key={v.videoId} v={v}/>)}
    </SimpleGrid >
  );  
}