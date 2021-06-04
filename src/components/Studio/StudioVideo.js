import moment from 'moment';
// import dashjs from 'dashjs';
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
  Button,
  HStack, } from '@chakra-ui/react';
import { useEffect, } from 'react';
import { IoPlayOutline, IoPauseOutline, } from 'react-icons/io5';
import { useRouter, } from 'next/router';
import EditTitle from './EditTitle';
import videoDuration from '../../utils/videoDuration';
import DeleteVideo from './DeleteVideo';
import EditVisibility from './EditVisibility';

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
    const player = dashjs.MediaPlayer().create();
    player.initialize(document.querySelector('#videoPlayer'), link, true);
  }, []);

  return (
    <video id='videoPlayer' autoPlay preload='none' controls/>
  );
}

export default function StudioVideo({ v }) {
  const router = useRouter();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const shareLink = `https://bken.io/v/${v.videoId}`;

  return (
    <Box borderWidth='1px' borderRadius='md' overflow='hidden'>
      <Box
        w='100%' h='200px'
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
                <Progress isAnimated w='50%' minW='200px' colorScheme='teal' hasStripe borderRadius='lg' height='15px' value={v.percentCompleted} />
              </Flex> ) :
              <IconButton
                size='lg'
                variant='outline'
                onClick={onOpen}
                aria-label='watch'
                icon={<IoPlayOutline w='100%' h='100%'/>}
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
      <Box p='2' bg='transparent' w='100%' color='white'>
        <EditTitle id={v.videoId} title={v.title} />
        <Flex direction='column'>
          <Metadata v={v}/>
          <Text fontSize='xs' mx='5px' cursor='pointer'
            onClick={() => {navigator.clipboard.writeText(shareLink);}}
          >{shareLink}</Text>
        </Flex>

        <Flex pt='1' justifyContent='end'>
          <HStack>
            <Button
              size='xs'
              variant='outline'
              disabled={v.status !== 'completed'}
              onClick={() => { router.push(`/v/${v.videoId}`); }}
            > Watch page
            </Button>
            <Menu>
              <MenuButton variant='outline' size='xs' as={Button}>
                More
              </MenuButton>
              <MenuList>
                <MenuItem>
                  <DeleteVideo id={v.videoId}/>
                </MenuItem>
              </MenuList>
            </Menu>
          </HStack>
        </Flex>
      </Box>
      <Modal size='4xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          <VideoPlayer link={v.mpdLink}/>
        </ModalContent>
      </Modal>
    </Box>
  );
}