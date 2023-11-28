import useSWR from 'swr'
import DeleteAsset from './DeleteAsset'
import VideoAsetDetails from './VideoAssetDetails'

import { Asset } from '../../types'
import { Link, useParams } from 'react-router-dom'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ButtonGroup,
  Flex,
  Heading,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'

export default function Asset() {
  const { assetId } = useParams()
  const { data, isLoading, error } = useSWR(
    `/api/assets/${assetId ? assetId : ''}`
  )
  const asset = data as Asset

  if (isLoading)
    return (
      <Box>
        <Text>Loading...</Text>
      </Box>
    )

  if (!isLoading && error) {
    return (
      <Box>
        <Text>Unable to load asset.</Text>
        <Text>{JSON.stringify(error)}</Text>
      </Box>
    )
  }

  const bg = useColorModeValue('gray.100', 'gray.900')

  return (
    <Flex w="100%" align="center" justify="center" direction="column">
      <Box maxW="1400px">
        <Flex py="2" w="100%" justify="space-between">
          <Box>
            <Breadcrumb>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to="/assets">
                  Assets
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbItem>
                <BreadcrumbLink as={Link} to={`/assets/${asset.id}`}>
                  Asset
                </BreadcrumbLink>
              </BreadcrumbItem>
            </Breadcrumb>
            <Heading my="2" size="lg">{`Asset`}</Heading>
          </Box>
          <ButtonGroup variant="outline" spacing="6">
            <DeleteAsset assetId={asset.id} to="/assets" />
          </ButtonGroup>
        </Flex>
        <Box p="2" mb="6" rounded="sm" bg={bg}>
          <Text>{`${asset.id}`}</Text>
        </Box>
        {asset.contentType.includes('video') ? (
          <VideoAsetDetails asset={asset} />
        ) : (
          'Unable to display asset.'
        )}
      </Box>
    </Flex>
  )
}
