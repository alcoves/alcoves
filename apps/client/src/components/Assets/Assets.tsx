import useSWR from 'swr'
import CreateAsset from './CreateAsset'

import {
  Box,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { Asset } from '../../types'
import { Link, useNavigate } from 'react-router-dom'

export default function Assets() {
  const navigate = useNavigate()
  const { data } = useSWR('/api/assets')

  return (
    <Box>
      <Box py="2">
        <Breadcrumb>
          <BreadcrumbItem>
            <BreadcrumbLink as={Link} to="/assets">
              Assets
            </BreadcrumbLink>
          </BreadcrumbItem>
        </Breadcrumb>
        <Heading my="2" size="lg">{`Assets`}</Heading>
      </Box>
      <Flex py="2" w="100%" justify="flex-end">
        <CreateAsset />
      </Flex>
      <Table variant="simple">
        <Thead>
          <Tr>
            <Th></Th>
            <Th>ID</Th>
            <Th>Type</Th>
            <Th>Status</Th>
            <Th>Created</Th>
          </Tr>
        </Thead>
        <Tbody>
          {data?.map((asset: Asset) => {
            return (
              <Tr
                fontSize=".9em"
                key={asset.id}
                cursor="pointer"
                _hover={{ bg: useColorModeValue('gray.100', 'gray.700') }}
                onClick={() => {
                  navigate(`/assets/${asset.id}`)
                }}
              >
                <Td>thumbnail</Td>
                <Td>{asset.id}</Td>
                <Td>{asset.contentType}</Td>
                <Td>{asset.status}</Td>
                <Td>
                  {DateTime.fromISO(asset.createdAt).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </Td>
              </Tr>
            )
          })}
        </Tbody>
      </Table>
    </Box>
  )
}
