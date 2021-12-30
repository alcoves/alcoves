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
  pod,
  resetSelection,
  mediaReferenceIds,
}: {
  pod: any
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
      url: `http://localhost:4000/pods/${pod.id}/media`,
    })
  }

  useEffect(() => {
    if (!loading && !error && data) {
      mutate(`http://localhost:4000/pods/${pod.id}/media`)
      resetSelection()
      onClose()
    }
  }, [data, error, loading])

  const headerText = pod?.isDefault ? 'Delete Media' : 'Unshare Media'

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
          <ModalHeader>{headerText}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {pod?.isDefault ? (
              <Text>
                Are you sure you want to permenantly delete the selected items? This action is
                irreversible!
              </Text>
            ) : (
              <Text>
                Are you sure you want to remove the selected media? The owner will still have access
                to the selected media
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} variant='ghost' onClick={onClose}>
              Close
            </Button>
            <Button colorScheme='red' isLoading={loading} onClick={handleRemove}>
              {pod?.isDefault ? 'Delete Forever' : 'Remove from pod'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
