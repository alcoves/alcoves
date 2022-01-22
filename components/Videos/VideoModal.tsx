import Player from './Player'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalCloseButton,
  Heading,
  ModalBody,
  Spinner,
  Flex,
} from '@chakra-ui/react'
import { Video } from '../../types/types'
import { getHlsUrl } from '../../utils/urls'
import { fetcher } from '../../utils/axios'
import useSWR from 'swr'

export default function MediaItemModal({
  v,
  isOpen,
  onClose,
}: {
  v: Video
  isOpen: boolean
  onClose: () => void
}) {
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/libraries/${v.libraryId}/videos/${v.id}`,
    fetcher
  )

  return (
    <>
      <Modal size='6xl' isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalCloseButton />
          {data?.payload?.status === 'READY' ? (
            <Player src={getHlsUrl(data?.payload?.id)} />
          ) : (
            <Flex justify='center' align='center' w='100%' h='300px'>
              <Spinner />
            </Flex>
          )}
          <ModalBody>
            <Heading size='md'>{data?.payload?.title}</Heading>
            <pre>{JSON.stringify(data?.payload, null, 2)}</pre>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
