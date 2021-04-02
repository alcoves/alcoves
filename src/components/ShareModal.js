import {
  Flex,
  Text,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Switch, } from '@chakra-ui/react';
import { useEffect, useState, } from 'react';
import videoDuration from '../utils/videoDuration';

export default function ShareModal({ link, vRef }) {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [shareLink, setShareLink] = useState(link);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    setCurrentTime(vRef?.current?.currentTime);
  }, [isOpen]);

  return(
    <>
      <Button onClick={onOpen} size='sm'>Share</Button>
      <Modal w='1024px' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Flex
              w='100%'
              direction='column'
              alignItems='center'
            >
              <Text fontSize='sm' >{shareLink}</Text>
              <Button
                my='10px'
                w='100%'
                size='sm'
                variant='outline'
                onClick={() => {navigator.clipboard.writeText(shareLink);}}
              >
                Copy
              </Button>
            </Flex>
          </ModalBody>
          <ModalFooter justifyContent='start'>
            <Switch onChange={({ target }) => {
              if (target.checked) {
                setShareLink(`${shareLink}?t=${currentTime.toFixed(0)}`);
              } else {
                setShareLink(link);
              }
            }}/>
            <Text mx='5px'>{videoDuration(currentTime.toFixed(0))}</Text>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}