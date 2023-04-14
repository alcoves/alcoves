import { useQuery } from '@tanstack/react-query'
import { getAssets } from '../../lib/api'
import { Box } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ListAsset from './ListAsset'
import FileList from './FileList'
import FolderList from './FolderList'

export default function ListAssets() {
  const router = useRouter()

  const { isLoading, isError, data, error } = useQuery({
    enabled: router.isReady,
    queryKey: ['assets', router.asPath],
    queryFn: async () => {
      const data = await getAssets(router.asPath)
      return data
    },
  })

  if (data?.assets?.length) {
    if (data.assets.length === 1 && data.assets[0].type === 'file') {
      console.log(data.assets.length, data.assets[0].type)
      return <ListAsset asset={data?.assets[0]} />
    }

    return (
      <Box w="100%" p="4">
        <FolderList assets={data?.assets} />
        <FileList assets={data?.assets} />
      </Box>
    )
  }

  return null
}
