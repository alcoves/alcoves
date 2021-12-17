import useSWR from 'swr'
import axios from '../../utils/axios'
import Layout from '../../components/Layout'
import PodName from '../../components/Pods/PodName'
import MediaItem from '../../components/Pods/MediaItem'
import ShareMedia from '../../components/Pods/ShareMedia'
import PodSettings from '../../components/Pods/PodSettings'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { fetcher } from '../../utils/axios'
import { usePod } from '../../hooks/usePods'
import { IoTrashBin } from 'react-icons/io5'
import { Box, Flex, IconButton, SimpleGrid, Wrap } from '@chakra-ui/react'

function PodMedia() {
  const router = useRouter()
  const { podId } = router.query
  const { pod } = usePod(podId)
  const [selected, setSelected] = useState<number[]>([])
  const { data, mutate } = useSWR(
    podId ? `http://localhost:4000/pods/${podId}/media` : null,
    fetcher
  )

  function handleSelect(e: any, id: number) {
    if (e.ctrlKey) {
      const index = selected.indexOf(id)
      if (index > -1) {
        setSelected(prev => prev.filter(Id => Id !== id))
      } else {
        setSelected(prev => [...prev, id])
      }
    }
  }

  async function deleteSelected() {
    try {
      await axios.delete(`http://localhost:4000/pods/${podId}/media`, {
        data: { mediaReferenceIds: selected },
      })
    } catch (error) {
      console.error(error)
    } finally {
      mutate()
      setSelected([])
    }
  }

  return (
    <Box w='100%'>
      <Wrap>
        <IconButton
          colorScheme='red'
          icon={<IoTrashBin />}
          onClick={deleteSelected}
          aria-label='delete-selected'
          isDisabled={!selected.length}
        />
        {pod?.isDefault && <ShareMedia podId={podId} mediaReferenceIds={selected} />}
        <PodSettings />
      </Wrap>
      <SimpleGrid pt='4' minChildWidth={['100%', '400px']} spacing='4px'>
        {data?.payload?.media?.map((mediaReference: any) => {
          return (
            <Box
              rounded='sm'
              key={mediaReference.id}
              onClick={e => handleSelect(e, mediaReference.id)}
              border={
                selected.includes(mediaReference.id) ? 'solid teal 2px' : 'solid transparent 2px'
              }
            >
              <MediaItem m={mediaReference?.media} />
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}

export default function Pod() {
  const router = useRouter()
  const { podId } = router.query
  const { pod } = usePod(podId ? podId : null)

  return (
    <Layout>
      <Flex key={pod?.id} direction='column' align='start' w='100%' px='4' pb='2'>
        <Flex py='4'>
          <PodName pod={pod} />
        </Flex>
        <PodMedia />
      </Flex>
    </Layout>
  )
}
