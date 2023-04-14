import { Box, SimpleGrid, Text } from '@chakra-ui/react'
import { useRouter } from 'next/router'

export default function FolderList({ assets }: { assets: any[] }) {
  const router = useRouter()
  const justFolders = assets.filter((asset) => asset.type === 'folder')

  function handleClick(e, assetLocation) {
    e.preventDefault()
    console.log('pushing', assetLocation)
    router.push(`${router.asPath}/${assetLocation}`)
  }

  if (justFolders.length) {
    return (
      <>
        <SimpleGrid minChildWidth="200px" spacing={2}>
          {justFolders.map((asset) => {
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
      </>
    )
  }
  return null
}
