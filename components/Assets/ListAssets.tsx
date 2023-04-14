import { useQuery  } from "@tanstack/react-query";
import { getAssets } from "../../lib/api";
import { Box, Heading, SimpleGrid, Text } from "@chakra-ui/react";
import { useRouter } from "next/router";
import ListAsset from "./ListAsset";
import Link from "next/link";
;

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
      e.preventDefault();
      console.log("pushing", assetLocation)
      router.push(`${router.asPath}/${assetLocation}`);
    }

    return (
      <SimpleGrid minChildWidth='200px' spacing={2}>
        {folders.map((asset) => {
          return (
            <Box key={asset.fullPath}  onClick={(e) => handleClick(e, asset.name)} _hover={{ bg: "teal.600" }} cursor='pointer' bg='gray.900' borderRadius='4' p='2'>
              <Text fontSize='.9rem' isTruncated>
              {asset.name}
              </Text>
            </Box>
          )
        })}
      </SimpleGrid>
    )
  }

  function renderFiles(assets: any[]) {
    const files = assets.filter((asset) => asset.type === 'file')
    return files.map((asset) => {
      return (
        <Box key={asset.fullPath}>
          <Link href={`${router.asPath}/${asset.name}`}>
            <Text>
              {asset.name}  
            </Text>
          </Link>
        </Box>
      )
    })
  }

  if (data?.assets?.length) {

    if (data.assets.length === 1 && data.assets[0].type === 'file') {
      console.log(data.assets.length, data.assets[0].type)
      return <ListAsset asset={data?.assets[0]}/>
    }

    return (
      <Box w='100%' p='4'>
        breadcrumb
        <Heading my='2'>Folders</Heading>
        {renderFolders(data?.assets)}
        <Heading my='2'>Files</Heading>
        { renderFiles(data?.assets)}
      </Box>
    );
  }

  return null
}
