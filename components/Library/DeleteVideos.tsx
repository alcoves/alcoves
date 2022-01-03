import useLazyRequest from '../../hooks/useLazyRequest'
import {
  Modal,
  Button,
  ModalBody,
  IconButton,
  ModalHeader,
  ModalFooter,
  ModalContent,
  ModalOverlay,
  useDisclosure,
  ModalCloseButton,
} from '@chakra-ui/react'
import { useEffect } from 'react'
import { useSWRConfig } from 'swr'
import { IoTrashBin } from 'react-icons/io5'

export default function DeleteVideos({
  videoIds,
  libraryId,
  resetSelection,
}: {
  libraryId: string
  videoIds: string[]
  resetSelection: () => void
}) {
  const { mutate } = useSWRConfig()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [removeMedia, { data, loading, error }] = useLazyRequest()

  async function handleRemove() {
    console.log('VideoIds', videoIds)
    removeMedia({
      method: 'DELETE',
      data: { ids: videoIds },
      url: `http://localhost:4000/libraries/${libraryId}/videos`,
    })
  }

  useEffect(() => {
    if (!loading && !error && data) {
      mutate(`http://localhost:4000/libraries/${libraryId}/videos`)
      resetSelection()
      onClose()
    }
  }, [data, error, loading])

  return (
    <>
      <IconButton
        colorScheme='red'
        icon={<IoTrashBin />}
        onClick={onOpen}
        aria-label='delete-selected'
        isDisabled={!videoIds.length}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Media</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            Are you sure you want to permenantly delete the selected items? This action is
            irreversible!
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} variant='ghost' onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='red' isLoading={loading} onClick={handleRemove}>
              Delete Forever
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
