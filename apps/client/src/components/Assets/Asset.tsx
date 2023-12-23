import useSWR from 'swr'
import DeleteAsset from './DeleteAsset'
import VideoAssetDetails from './VideoAssetDetails'

import { Asset } from '../../types'
import { Link, useParams } from 'react-router-dom'
import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  ButtonGroup,
  Code,
  Flex,
  HStack,
  Heading,
  Image,
  Input,
  Text,
  useColorModeValue,
} from '@chakra-ui/react'
import { useConfig } from '../../contexts/ConfigContext'
import RetryIngest from './RetryIngest'
import { useState } from 'react'
import RetryStoryboard from './RetryStoryboard'

export default function Asset() {
  const { assetId } = useParams()
  const { getThumbnailUrlBase } = useConfig()
  const [thumbnail, setThumbnail] = useState(`.jpg?w=1280`)
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
      <Box w="100%" maxW="1400px">
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
        <Box p="2" mb="4" rounded="sm" bg={bg}>
          <Text>{`${asset.id}`}</Text>
        </Box>
        <HStack mb="4" justify="end" w="100%">
          <RetryStoryboard assetId={asset.id} />
          <RetryIngest assetId={asset.id} />
        </HStack>
        {asset.contentType.includes('video') ? (
          <VideoAssetDetails asset={asset} />
        ) : (
          'Unable to display asset.'
        )}
        <Box py="2" w="100%">
          <Heading size="lg">Thumbnail</Heading>
          <Code
            my="2"
            w="100%"
            maxW="500px"
            rounded="sm"
            colorScheme="gray"
            children={getThumbnailUrlBase(assetId)}
          ></Code>
          <Input
            my="2"
            size="sm"
            w="100%"
            maxW="500px"
            rounded="sm"
            variant="filled"
            colorScheme="gray"
            value={thumbnail}
            onChange={(e) => {
              setThumbnail(e.target.value)
            }}
          />
          <Image
            w="100%"
            maxW="500px"
            rounded="sm"
            alt="thumbnail"
            src={`${getThumbnailUrlBase(assetId)}${thumbnail}`}
          />
        </Box>
      </Box>
    </Flex>
  )
}
