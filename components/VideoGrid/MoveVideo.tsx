import {
  Text,
  Flex,
  Avatar,
  IconButton,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Button,
} from '@chakra-ui/react'
import { useState } from 'react'
import { IoSend } from 'react-icons/io5'
import useSWR, { useSWRConfig } from 'swr'
import { Pod } from '../../types'
import { getApiUrl } from '../../utils/api'
import { fetcher, fetchMutate } from '../../utils/fetcher'

export default function MoveVideo(props: { id: string; podId: string }): JSX.Element {
  const { mutate } = useSWRConfig()
  const [loading, setLoading] = useState(false)
  const [selectedPodId, setSelectedPodId] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()

  const fetchUrl = `${getApiUrl()}/pods`
  const { data: pods } = useSWR(fetchUrl, fetcher)

  async function handleMove() {
    try {
      setLoading(true)
      await fetchMutate({
        method: 'patch',
        url: `${getApiUrl()}/videos/${props.id}`,
        data: { pod: selectedPodId },
      })
    } catch (error) {
      console.error(error)
    } finally {
      onClose()
      setLoading(false)
      mutate(`${getApiUrl()}/pods/${props.podId}/videos`)
    }
  }

  console.log(pods?.data)

  return (
    <>
      <IconButton aria-label='delete-video' onClick={onOpen} size='sm' icon={<IoSend />} />
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Move Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Moving a video will make it unavailible in the current pod. You can always move it
              back though
            </Text>
            {pods?.data.map((p: Pod) => {
              return (
                <Flex
                  p='2'
                  my='2'
                  key={p._id}
                  rounded='md'
                  bg={selectedPodId === p._id ? 'gray.500' : 'gray.600'}
                  align='center'
                  cursor='pointer'
                  onClick={() => {
                    setSelectedPodId(p._id)
                  }}
                >
                  <Avatar name={p.name} />
                  <Text ml='4'>{p.name}</Text>
                </Flex>
              )
            })}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' variant='ghost' mr={3} onClick={onClose}>
              Close
            </Button>
            <Button onClick={handleMove} colorScheme='blue' isLoading={loading} variant='solid'>
              Move
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
