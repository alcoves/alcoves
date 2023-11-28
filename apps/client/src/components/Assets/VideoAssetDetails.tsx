import { Asset } from '../../types'
import {
  AspectRatio,
  Box,
  Flex,
  Text,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'

function VideoPlayer({ asset }: { asset: Asset }) {
  return (
    <Box w="100%" h="100%">
      <AspectRatio ratio={16 / 9}>
        <video
          muted
          autoPlay
          controls
          src={asset.url}
          style={{ maxWidth: '100%' }}
        />
      </AspectRatio>
    </Box>
  )
}

function DetailRow({ label, data }: { label: string; data: string }) {
  return (
    <Flex w="100%">
      <Text fontSize=".9em" minW="100px" maxW="100px" w="100px">
        {label}
      </Text>
      <Text fontSize=".9em">{data}</Text>
    </Flex>
  )
}

export default function VideoAsetDetails({ asset }: { asset: Asset }) {
  return (
    <Flex
      w="100%"
      rounded="sm"
      borderWidth={2}
      borderColor={useColorModeValue('gray.300', 'gray.900')}
    >
      <VideoPlayer asset={asset} />
      <VStack p="2" align="start" w="100%">
        <DetailRow label="Asset ID" data={asset.id} />
        <DetailRow label="Type" data={asset.contentType} />
        <DetailRow label="Status" data={asset.status} />
        <DetailRow
          label="Created"
          data={new Date(asset.createdAt).toLocaleString()}
        />
        <DetailRow
          label="Updated"
          data={new Date(asset.updatedAt).toLocaleString()}
        />
      </VStack>
    </Flex>
  )
}
