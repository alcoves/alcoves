import moment from 'moment';
import { Box, Flex, Progress , Text, Modal, VStack, Spacer,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Skeleton,
  Button,
  ModalBody,
  ModalHeader,
  ModalFooter,
  Spinner,
} from '@chakra-ui/react';
import useSWR from 'swr';
import videoDuration from '../../utils/videoDuration';
import DeleteVideo from './DeleteVideo';
import DirectLink from './DirectLink';
import EditTitle from './EditTitle';
import EditVisibility from './EditVisibility';
import { IoGlobe, } from 'react-icons/io5';
import VideoPlayer from '../VideoPlayer/Index';

const fetcher = (url) => fetch(url).then((res) => res.json());

function Metadata({ v }) {
  const createdAt = moment(v.createdAt).fromNow();
  return (
    <Flex align='center'>
      {v.visibility === 'public' ?
        <Box mr='2'><IoGlobe/></Box> : null
      }
      <Text fontSize='xs'>
        {`${createdAt} - ${v.views} views`}
      </Text>
    </Flex>
  );
}

export default function StudioVideoCard({ v = {} }) {
  const { data: video, mutate } = useSWR(
    `/api/videos/${v?.id}`, fetcher,
    { initialData: v, refreshInterval: v?.status === 'completed' ? 0 : 2000 }
  );
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <Box overflow='hidden'>
      <Skeleton isLoaded={Boolean(video.id)}>
        <Box
          borderRadius='md'
          cursor='pointer'
          onClick={onOpen}
          w='100%' h='200px' bgImage={`url("${video.thumbnail}")`}
          bgSize='cover' bgColor='black' bgPosition='center' bgRepeat='no-repeat'
        >
          <Flex w='100%' h='100%' justify='center' align='center' direction='column' p='1'>
            <Flex></Flex>
            <Spacer/>
            <Flex>
              {video.status !== 'completed' && <Spinner color='#ffcc00'/>}
            </Flex>
            <Spacer/>
            <Flex justify='end' w='100%'>
              <Flex
                justify='center' align='center'
                bg='rgba(10, 10, 10, .4)'borderRadius='md' px='1'
              >
                <Text color='gray.100' fontSize='xs' fontWeight='bold'>
                  {videoDuration(video.duration)}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        </Box>
        <Box>
          <Box h='3px'>
            {video.status !== 'completed' && <Progress
              height='3px'
              colorScheme='teal'
              value={video?.percentCompleted}
            />}
          </Box>
          <Box p='2' bg='transparent' w='100%'>
            <Flex direction='column'>
              <Text isTruncated fontSize='.8rem' fontWeight='700'>{video?.title}</Text>
              <Metadata v={v}/>
            </Flex>
          </Box>
        </Box>

        <Modal size='xl' isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>
              Edit Video
            </ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Flex direction='column'>
                <VStack align='start' spacing='4px' h='100%'>
                  <VideoPlayer url={video.mpdLink}/>
                  <Spacer/>
                  <EditTitle id={video.id} title={video.title} refetch={mutate}/>
                  <DirectLink id={video?.id}/>
                  {video.status === 'completed' &&
                    <Flex justify='space-between' w='100%' py='2'>
                      <EditVisibility id={video.id} visibility={video.visibility}/>
                      <DeleteVideo id={video.id} refetch={mutate}/>
                    </Flex>
                  }
                </VStack>
              </Flex>
            </ModalBody>
            <ModalFooter>
              <Button size='sm' onClick={onClose}>
                Close
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Skeleton>
    </Box>
  );
}