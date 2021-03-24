import moment from 'moment';
import EditTitle from './EditTitle';
import videoDuration from '../../utils/videoDuration';
import DeleteVideo from './DeleteVideo';
import EditVisibility from './EditVisibility';
import { Box, Flex, Progress , Text, Spacer, Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Heading,
  IconButton, } from "@chakra-ui/react"
import { useEffect, useRef } from 'react';
import { ChevronRightIcon } from '@chakra-ui/icons';

function Metadata({ v }) {
  const createdAt = moment(v.createdAt).fromNow();
  return (
    <Box py='1'>
      <Text fontSize="xs">{createdAt}</Text>
      <Text fontSize="xs">{`${v.views} views`}</Text>
    </Box>
  );
}

function VideoPlayer({ link }) {
  const vRef = useRef(null);

  useEffect(() => {
    const video = document.getElementById('bkenStudioPlayer');
    const hls = new window.Hls();
    hls.loadSource(link);
    hls.attachMedia(video);
  }, [])

  return <video autoPlay id="bkenStudioPlayer" controls ref={vRef} />
}

export default function StudioVideo({ v }) {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box borderWidth="1px" borderRadius="md" overflow="hidden">
      <Box
        w='100%' h='300px'
        bgSize='cover' bgColor='black'
        bgImage={`url("${v.thumbnail}")`}
        bgPosition='center' bgRepeat='no-repeat'
      >
        <Flex w='100%' h='100%' direction='column' p='2'>
          <Flex>
            <EditVisibility id={v.videoId} visibility={v.visibility}/>
            <Spacer/>
          </Flex>
          <Spacer/>
          <Flex align='center' direction='column'>
            {v.status !== 'completed' ? (
            <Flex direction='column' align='center'>
              <Heading size='sm' textTransform='uppercase' py='2'>{v.status}</Heading>
              <Progress w='50%' minW='200px' colorScheme="teal" hasStripe borderRadius='lg' height="15px" value={v.percentCompleted} />
            </Flex> ) :
            <IconButton
              size='lg'
              variant="outline"
              onClick={onOpen}
              aria-label="watch"
              icon={<ChevronRightIcon w='100%' h='100%'/>}
            />
            }
          </Flex>
          <Spacer/>
          <Flex>
            <Spacer/>
            <Flex bg='rgba(10, 10, 10, .4)' borderRadius='md' px='1' justify='center' align='center'>
              <Text fontSize='xs' fontWeight='bold'>{videoDuration(v.duration)}</Text>
            </Flex>
          </Flex>
        </Flex> 
      </Box>
      <Box p='2' bg="transparent" w="100%" color="white">
        <EditTitle id={v.videoId} title={v.title} />
        <Flex align='center'>
          <Metadata v={v}/>
          <Spacer/>
          <DeleteVideo id={v.videoId}/>
        </Flex>
      </Box>

      <Modal size='4xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <VideoPlayer link={v.hlsMasterLink}/>
        </ModalContent>
      </Modal>
    </Box>
  );
}