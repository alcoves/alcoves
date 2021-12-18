import useLazyRequest from '../../hooks/useLazyRequest'
import {
  Modal,
  Text,
  Button,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  IconButton,
} from '@chakra-ui/react'
import { IoTrashBin } from 'react-icons/io5'
import { useEffect } from 'react'
import { useSWRConfig } from 'swr'

export default function RemoveMedia({
  podId,
  resetSelection,
  mediaReferenceIds,
}: {
  podId: string | string[] | undefined
  resetSelection: () => void
  mediaReferenceIds: number[]
}) {
  const { mutate } = useSWRConfig()
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [removeMedia, { data, loading, error }] = useLazyRequest()

  async function handleRemove() {
    removeMedia({
      method: 'DELETE',
      data: { mediaReferenceIds },
      url: `http://localhost:4000/pods/${podId}/media`,
    })
  }

  useEffect(() => {
    if (!loading && !error && data) {
      mutate(`http://localhost:4000/pods/${podId}/media`)
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
        isDisabled={!mediaReferenceIds.length}
      />

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Media</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>Are you sure you want to remove these items from this pod?</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button isLoading={loading} variant='ghost' onClick={handleRemove}>
              Unshare
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
