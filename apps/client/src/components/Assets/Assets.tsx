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
  Select,
  useColorModeValue,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Image,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import { Asset } from '../../types'
import { Link, useNavigate } from 'react-router-dom'
import { useConfig } from '../../contexts/ConfigContext'
import { useState } from 'react'

export default function Assets() {
  const navigate = useNavigate()
  const { getThumbnailUrlBase } = useConfig()
  const [statusFilter, setStatusFilter] = useState('')
  const { data } = useSWR(`/api/assets${statusFilter}`)
  const bg = useColorModeValue('gray.100', 'gray.700')

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
        <Flex>
          <Select
            placeholder="ALL"
            variant="filled"
            onClick={(e: any) => {
              if (e.target.value) {
                const filter = `?status=${e.target.value}`
                if (statusFilter === filter) return
                setStatusFilter(filter)
              } else {
                setStatusFilter('')
              }
            }}
          >
            <option value="CREATED">CREATED</option>
            <option value="INGESTING">INGESTING</option>
            <option value="PROCESSING">PROCESSING</option>
            <option value="ERROR">ERROR</option>
            <option value="READY">READY</option>
          </Select>
        </Flex>
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
                _hover={{ bg }}
                onClick={() => {
                  navigate(`/assets/${asset.id}`)
                }}
              >
                <Td>
                  <Image
                    w="100px"
                    alt="thmb"
                    src={`${getThumbnailUrlBase(asset.id)}.jpg?w=100&q=50`}
                  />
                </Td>
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
