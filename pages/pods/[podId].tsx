import useSWR from 'swr'
import Layout from '../../components/Layout'
import PodName from '../../components/Pods/PodName'
import UploadList from '../../components/UploadList'
import MediaItem from '../../components/Media/MediaItem'
import ShareMedia from '../../components/Pods/ShareMedia'
import RemoveMedia from '../../components/Pods/RemoveMedia'
import PodSettings from '../../components/Pods/PodSettings'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { fetcher } from '../../utils/axios'
import { usePod } from '../../hooks/usePods'
import { Box, Flex, SimpleGrid, Text, Wrap } from '@chakra-ui/react'

function PodMedia() {
  const router = useRouter()
  const { podId } = router.query
  const { pod } = usePod(podId)
  const [selected, setSelected] = useState<number[]>([])
  const { data } = useSWR(podId ? `http://localhost:4000/pods/${podId}/media` : null, fetcher)

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

  function resetSelection() {
    setSelected([])
  }

  return (
    <Box w='100%'>
      <Wrap>
        <RemoveMedia resetSelection={resetSelection} podId={podId} mediaReferenceIds={selected} />
        {pod?.isDefault && <ShareMedia podId={podId} mediaReferenceIds={selected} />}
        <PodSettings />
      </Wrap>
      {pod?.isDefault ? <UploadList /> : null}
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
        <Flex py='4' direction='column'>
          <PodName pod={pod} />
          <Text fontSize='.85rem' fontStyle='italic'>
            {pod?.isDefault && 'This is your default pod'}
          </Text>
        </Flex>
        <PodMedia />
      </Flex>
    </Layout>
  )
}
