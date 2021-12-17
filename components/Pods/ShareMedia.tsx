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
  Tag,
  Wrap,
} from '@chakra-ui/react'
import { IoShare } from 'react-icons/io5'
import usePods from '../../hooks/usePods'
import { useEffect, useState } from 'react'
import useLazyRequest from '../../hooks/useLazyRequest'

export default function ShareMedia({
  podId,
  mediaItemIds,
}: {
  podId: string | string[] | undefined
  mediaItemIds: number[]
}) {
  const { pods } = usePods()
  const [selectedPod, setSelectedPod] = useState<any>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [addMedia, { data, loading, error }] = useLazyRequest()

  function handleShare() {
    addMedia({
      method: 'POST',
      data: { mediaItemIds },
      url: `http://localhost:4000/pods/${podId}/share`,
    })
  }

  useEffect(() => {
    if (!loading && !error && data) {
      // Success
      onClose()
    }
  })

  const selectablePods = pods?.filter((p: any) => {
    return p.id !== podId
  })

  return (
    <>
      <Button
        onClick={onOpen}
        colorScheme='teal'
        leftIcon={<IoShare />}
        isDisabled={!mediaItemIds.length}
      >
        Share
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Share Media</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedPod ? (
              <Tag colorScheme='green'>{selectedPod?.name}</Tag>
            ) : (
              <Wrap>
                {selectablePods?.map((p: any) => {
                  return (
                    <Tag
                      key={p.id}
                      cursor='pointer'
                      onClick={() => {
                        setSelectedPod(p)
                      }}
                    >
                      {p.name}
                    </Tag>
                  )
                })}
              </Wrap>
            )}
            <Text> Share with Select a pod to share with</Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button isLoading={loading} variant='ghost' onClick={handleShare}>
              {`Share ${
                mediaItemIds.length > 1
                  ? `${mediaItemIds.length} items`
                  : `${mediaItemIds.length} item`
              }`}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
