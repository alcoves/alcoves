import useSWR from 'swr'
import VideoItem from '../Videos/VideoItem'
import DeleteVideos from './DeleteVideos'
import { useState } from 'react'
import { fetcher } from '../../utils/axios'
import { Box, Flex, HStack, SimpleGrid } from '@chakra-ui/react'
import ShareVideos from './ShareVideos'

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
    const index = selected.indexOf(id)
    if (index > -1) {
      setSelected(prev => prev.filter(Id => Id !== id))
    } else {
      setSelected(prev => [...prev, id])
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
        <HStack w='100%' justify='end' spacing='1'>
          <ShareVideos libraryId={libraryId} videoIds={selected} resetSelection={resetSelection} />
          <DeleteVideos libraryId={libraryId} videoIds={selected} resetSelection={resetSelection} />
        </HStack>
        <SimpleGrid pt='1' minChildWidth={['100%', '400px']} spacing='4px'>
          {data?.payload?.map((v: any) => {
            return (
              <VideoItem
                v={v}
                key={v.id}
                handleSelect={handleSelect}
                isSelected={selected.includes(v.id)}
              />
            )
          })}
        </SimpleGrid>
      </Box>
    )
  }

  return null
}
