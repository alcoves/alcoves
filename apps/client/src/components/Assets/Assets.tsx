import useSWR from 'swr'
import CreateAsset from './CreateAsset'

import {
  Box,
  Heading,
  Table,
  HStack,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Flex,
  Select,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Image,
  Input,
  Text,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { Asset } from '../../types'
import { Link, useNavigate } from 'react-router-dom'
import { useConfig } from '../../contexts/ConfigContext'
import { useState } from 'react'
import { formatDuration } from '../../lib/util'

const operators = [{ label: 'Equals', value: 'eq' }]

const filters = [
  {
    label: 'Status',
    value: 'status',
    options: [
      { value: 'READY', label: 'Ready' },
      { value: 'INGESTING', label: 'Ingesting' },
      { value: 'ERROR', label: 'Error' },
      { value: 'PROCESSING', label: 'Processing' },
      { value: 'CREATED', label: 'Created' },
    ],
  },
]

export default function Assets() {
  const navigate = useNavigate()
  const bg = useColorModeValue('gray.100', 'gray.700')

  const [filter, setFilter] = useState({
    key: '',
    operator: '',
    value: '',
  })

  const { data } = useSWR(`/api/assets?limit=100${filter ? `&${filter}` : ''}`)

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
      <Flex py="2" w="100%" justify="space-between">
        <HStack></HStack>
        <CreateAsset />
      </Flex>
      <Table variant="simple" size="sm">
        <Thead>
          <Tr>
            {/* <Th></Th> */}
            <Th>ID</Th>
            <Th>Asset Version</Th>
            <Th>Duration</Th>
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
                _hover={{ bg }}
                onClick={() => {
                  navigate(`/assets/${asset.id}`)
                }}
              >
                {/* <Td>
                  <Image
                    w="100px"
                    alt="thmb"
                    src={`${getThumbnailUrlBase(asset.id)}.jpg?w=100&q=50`}
                  />
                </Td> */}
                <Td>{asset.id}</Td>
                <Td>{asset.version}</Td>
                <Td>{formatDuration(asset.duration)}</Td>
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
