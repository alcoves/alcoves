import useSWR from 'swr'
import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  ButtonGroup,
  Flex,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { Asset } from '../../types'
import { useNavigate } from 'react-router-dom'

import DeleteAsset from './DeleteAsset'
import CreateAsset from './CreateAsset'

export default function Assets() {
  const navigate = useNavigate()
  const { data, isLoading } = useSWR('/api/assets')

  return (
    <Box>
      <Heading size="lg">Assets</Heading>
      <Flex py="2" w="100%" justify="flex-end">
        <CreateAsset />
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th>ID</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Created</Th>
            <Th></Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((asset: Asset) => {
            return (
              <Tr
                key={asset.id}
                cursor="pointer"
                onClick={() => {
                  navigate(`/assets/${asset.id}`)
                }}
              >
                <Td>{asset.id}</Td>
                <Td>{asset.contentType}</Td>
                <Td>{asset.status}</Td>
                <Td>
                  {DateTime.fromISO(asset.createdAt).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </Td>
                <Td>
                  <Box _hover={{ display: 'block' }}>
                    <ButtonGroup variant="outline" spacing="6">
                      <DeleteAsset assetId={asset.id} />
                    </ButtonGroup>
                  </Box>
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Box>
  )
}
