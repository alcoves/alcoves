import useSWR from 'swr'
import Layout from '../../components/Layout'
import PodName from '../../components/Pods/PodName'
import Video from '../../components/Videos/VideoItem'
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
  const { data } = useSWR(
    podId ? `${process.env.NEXT_PUBLIC_API_URL}/pods/${podId}/media` : null,
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

  function resetSelection() {
    setSelected([])
  }

  return (
    <Box w='100%'>
      <Wrap>
        {pod?.isDefault ? (
          <>
            <RemoveMedia pod={pod} mediaReferenceIds={selected} resetSelection={resetSelection} />
            <ShareMedia podId={pod.id} mediaReferenceIds={selected} />
          </>
        ) : (
          <RemoveMedia pod={pod} mediaReferenceIds={selected} resetSelection={resetSelection} />
        )}
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
              <Video m={mediaReference?.media} />
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
