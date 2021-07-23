import {
  Box, Text, Progress, 
} from '@chakra-ui/react';

function getTotalProgress(file = {}, bytesUploaded = {}) {
  const totalBytesLoaded = Object.values(bytesUploaded).reduce((acc, cv) => {
    acc += cv;
    return acc;
  }, 0);
  return parseInt(((totalBytesLoaded / file.size || 0) * 100).toFixed(0));
}

export default function UploadItem({ item }) {
  const progressValue = getTotalProgress(item?.file, item?.bytesUploaded);
  return(
    <Box borderWidth='2px' my='2' rounded='md' p='2'>
      <Text fontSize='.8rem' fontWeight='800'>{item?.file?.name}</Text>
      <Text fontSize='.8rem' opacity='.7'>{item?.message}</Text>
      <Progress mt='2' rounded='md' h='2' value={progressValue} />
    </Box>
  );
}