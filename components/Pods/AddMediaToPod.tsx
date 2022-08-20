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
import { useSWRConfig } from 'swr'

import useLazyRequest from '../../hooks/useLazyRequest'
import { useVideos } from '../../stores/videos'
import { Pod } from '../../types/types'
import { getAPIUrl } from '../../utils/urls'
import VideoGridSelect from '../Videos/VideoGridSelect'

export default function AddMediaToPod({ pod, refetchUri }: { pod: Pod; refetchUri: string }) {
  const { mutate } = useSWRConfig()
  const [request] = useLazyRequest()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const { videos, start, loadMore, toggleSelected, getSelectedIds } = useVideos()

  useEffect(() => {
    start()
  }, [])

  async function handleAdd() {
    const selectedIds = getSelectedIds()

    try {
      await request({
        method: 'POST',
        data: { ids: selectedIds },
        url: `${getAPIUrl()}/pods/${pod.id}/videos`,
      })
      mutate(refetchUri)
      onClose()
    } catch (error) {
      console.error(error)
    }
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
