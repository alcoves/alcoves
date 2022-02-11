import useSWR from 'swr'
import VideoItem from '../Videos/VideoItem'
import DeleteVideos from './DeleteVideos'
import { useState } from 'react'
import { fetcher } from '../../utils/axios'
import { Box, Flex, SimpleGrid } from '@chakra-ui/react'

export default function LibraryGrid({ libraryId }: { libraryId: string }) {
  const [selected, setSelected] = useState<string[]>([])
  const { data } = useSWR(
    `${process.env.NEXT_PUBLIC_API_URL}/libraries/${libraryId}/videos`,
    fetcher,
    {
      refreshInterval: 3000,
    }
  )

  function handleSelect(e: any, id: string) {
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

  if (data && !data?.payload?.length) {
    return <Box>Upload some content to get started!</Box>
  }

  if (data) {
    return (
      <Box>
        <Flex w='100%' justify='end'>
          <DeleteVideos libraryId={libraryId} videoIds={selected} resetSelection={resetSelection} />
        </Flex>
        <SimpleGrid pt='1' minChildWidth={['100%', '400px']} spacing='4px'>
          {data?.payload?.map((v: any) => {
            return (
              <Box
                key={v.id}
                rounded='sm'
                onClick={e => handleSelect(e, v.id)}
                border={selected.includes(v.id) ? 'solid teal 2px' : 'solid transparent 2px'}
              >
                <VideoItem v={v} />
              </Box>
            )
          })}
        </SimpleGrid>
      </Box>
    )
  }

  return null
}
