import {
  Modal,
  Button,
  ModalBody,
  ModalHeader,
  ModalFooter,
  ModalOverlay,
  ModalContent,
  useDisclosure,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useEffect } from 'react'

import { useVideos } from '../../stores/videos'
import VideoGridSelect from '../Videos/VideoGridSelect'

export default function AddMediaToPod() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { videos, start, loadMore, toggleSelected, getSelectedIds } = useVideos()

  useEffect(() => {
    start()
  }, [])

  function handleAdd() {
    // const selectedIds = getSelectedIds()
    // Go add them via the API
  }

  return (
    <>
      <Button size='sm' onClick={onOpen}>
        Add
      </Button>
      <Modal isOpen={isOpen} onClose={onClose} size='full'>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Add to pod</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VideoGridSelect videos={videos} loadMore={loadMore} toggleSelected={toggleSelected} />
          </ModalBody>
          <ModalFooter>
            <Button onClick={handleAdd} colorScheme='blue'>
              Add
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
