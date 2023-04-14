import 'vidstack/styles/defaults.css';

import { MediaOutlet, MediaPlayer } from '@vidstack/react';
import { Box } from '@chakra-ui/react';

export default function ListAsset({ asset }: { asset: any }) {
  return (
    <Box w='100%' h='1000px'>
      <MediaPlayer autoplay controls={true} src={asset.streamUri} aspectRatio={16/9} >
        <MediaOutlet />
      </MediaPlayer>
    </Box>
  );
}
