import { useQuery } from '@tanstack/react-query'
import { getAssets } from '../../lib/api'
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import ListAsset from './ListAsset'
import FileList from './FileList'

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

  function renderFolders(assets: any[]) {
    const folders = assets.filter((asset) => asset.type === 'folder')

    function handleClick(e, assetLocation) {
      e.preventDefault()
      console.log('pushing', assetLocation)
      router.push(`${router.asPath}/${assetLocation}`)
    }

    return (
      <SimpleGrid minChildWidth="200px" spacing={2}>
        {folders.map((asset) => {
          return (
            <Box
              key={asset.fullPath}
              onClick={(e) => handleClick(e, asset.name)}
              _hover={{ bg: 'blue.600' }}
              cursor="pointer"
              bg="gray.900"
              borderRadius="4"
              p="2"
            >
              <Text fontSize=".9rem" isTruncated>
                {asset.name}
              </Text>
            </Box>
          )
        })}
      </SimpleGrid>
    )
  }

  if (data?.assets?.length) {
    if (data.assets.length === 1 && data.assets[0].type === 'file') {
      console.log(data.assets.length, data.assets[0].type)
      return <ListAsset asset={data?.assets[0]} />
    }

    return (
      <Box w="100%" p="4">
        breadcrumb
        <Heading my="2">Folders</Heading>
        {renderFolders(data?.assets)}
        <FileList assets={data?.assets} />
      </Box>
    )
  }

  return null
}
