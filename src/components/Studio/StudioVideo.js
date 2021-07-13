import moment from 'moment';
import { Box, Flex, Progress , Text, Spacer, Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  useDisclosure,
  Heading,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  MenuItem,
  Skeleton,
  Button,
  HStack, } from '@chakra-ui/react';
import { useEffect, } from 'react';
import { IoPlayOutline, } from 'react-icons/io5';
import useSWR from 'swr';
import shaka from 'shaka-player';
import EditTitle from './EditTitle';
import videoDuration from '../../utils/videoDuration';
import DeleteVideo from './DeleteVideo';
import EditVisibility from './EditVisibility';
import Link from 'next/Link';

const fetcher = (url) => fetch(url).then((res) => res.json());

function Metadata({ v }) {
  const createdAt = moment(v.createdAt).fromNow();
  return (
    <Box p='1'>
      <Text fontSize='xs'>{createdAt} - {`${v.views} views`}</Text>
    </Box>
  );
}

function VideoPlayer({ link }) {
  useEffect(() => {
    const video = document.getElementById('studioVideoPlayer');
    const player = new shaka.Player(video);

    player.configure({
      manifest: {
        dash: {
          ignoreEmptyAdaptationSet: true,
        },
      },
    });

    player.load(link).then(() => {
      console.log('The video has now been loaded!');
    }).catch((err) => {
      console.error(err);
    });
  }, []);

  return (
    <video
      style={{ width: '100%', height: '100%', background: 'black' }}
      id='studioVideoPlayer' controls autoPlay width='100%' height='100%'
    />
  );
}

export default function StudioVideo({ v = {}, refetch }) {
  const { data: video } = useSWR(
    `/api/videos/${v?.videoId}`, fetcher,
    { initialData: v, refreshInterval: v?.status === 'completed' ? 0 : 2000 }
  );
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareLink = `https://bken.io/v/${video.videoId}`;

  return (
    <Box borderWidth='1px' borderRadius='md' overflow='hidden'>
      <Skeleton isLoaded={Boolean(video.videoId)}>
        <Box
          w='100%' h='200px'
          bgSize='cover' bgColor='black'
          bgImage={`url("${video.thumbnail}")`}
          bgPosition='center' bgRepeat='no-repeat'
        >
          <Flex w='100%' h='100%' direction='column' p='2'>
            <Flex>
              
              <Spacer/>
            </Flex>
            <Spacer/>
            <Flex align='center' direction='column'>
              {video.status !== 'completed' ? (
                <Flex direction='column' align='center'>
                  <Heading size='sm' textTransform='uppercase' py='2'>
                    {video.status}
                  </Heading>
                  <Progress
                    w='50%'
                    hasStripe
                    isAnimated
                    minW='200px'
                    height='15px'
                    borderRadius='lg'
                    colorScheme='teal'
                    value={video.percentCompleted}
                  />
                  <Text pt='1' fontSize='xs' fontWeight={800}>
                    {`${parseFloat(video?.percentCompleted).toFixed(2)}%`}
                  </Text>
                </Flex> ) :
                <IconButton
                  size='lg'
                  rounded='md'
                  onClick={onOpen}
                  variant='solid'
                  aria-label='watch'
                  icon={<IoPlayOutline color='inherit' w='100%' h='100%'/>}
                />
              }
            </Flex>
            <Spacer/>
            <Flex>
              <Spacer/>
              <Flex bg='rgba(10, 10, 10, .4)' borderRadius='md' px='1' justify='center' align='center'>
                <Text color='gray.100' fontSize='xs' fontWeight='bold'>{videoDuration(video.duration)}</Text>
              </Flex>
            </Flex>
          </Flex> 
        </Box>
        <Box p='2' bg='transparent' w='100%'>
          <Flex direction='row'>
            <Box mr='2'><EditVisibility id={video.videoId} visibility={video.visibility}/></Box>
            <EditTitle id={video.videoId} title={video.title} />
          </Flex>
          <Flex direction='column'>
            <Metadata v={v}/>
            <Text fontSize='xs' mx='5px' cursor='pointer'
              onClick={() => {navigator.clipboard.writeText(shareLink);}}
            >{shareLink}</Text>
          </Flex>
          <Flex pt='1' justifyContent='end'>
            <HStack>
              <Link href={`/v/${video.videoId}`}>
                <Button
                  size='xs'
                  variant='outline'
                  disabled={video.status !== 'completed'}
                > Watch page
                </Button>
              </Link>
              <Menu>
                <MenuButton variant='outline' size='xs' as={Button}>
                  More
                </MenuButton>
                <MenuList minW='auto'>
                  <MenuItem>
                    <DeleteVideo id={video.videoId} refetch={refetch}/>
                  </MenuItem>
                </MenuList>
              </Menu>
            </HStack>
          </Flex>
        </Box>
        <Modal size='4xl' isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent maxH='80vh' backgroundColor='black'>
            <ModalCloseButton />
            <VideoPlayer link={video.mpdLink}/>
          </ModalContent>
        </Modal>
      </Skeleton>
    </Box>
  );
}