import StudioVideo from './StudioVideo';
import { SimpleGrid  } from "@chakra-ui/react"

export default function StudioVideoGrid({ videos }) {
  return ( 
    <SimpleGrid columns={[2, null, 3]} spacing="10px">
      {videos.map(v => <StudioVideo key={v.videoId} v={v}/>)}
    </SimpleGrid >
  );  
}