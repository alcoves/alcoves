import {
  Box,
  Flex,
  Spinner,
  Text,
  VStack,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Heading,
  HStack,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import useSWR from 'swr'

import ReprocessButton from '../components/Admin/ReprocessButton'
import Card from '../components/Card'
import Layout from '../components/Layout'
import { Video } from '../types/types'
import { fetcher } from '../utils/axios'
import duration from '../utils/duration'
import { getAPIUrl } from '../utils/urls'

export default function AdminPage() {
  const { data } = useSWR(`${getAPIUrl()}/admin/videos`, fetcher)

  return (
    <Layout>
      <Flex p='2' direction='column'>
        <Box p='2'>Admin UI</Box>
        {data ? (
          <VStack spacing={1}>
            {data?.payload?.map((v: Video) => {
              return (
                <Card key={v.id}>
                  <Flex p='2'>
                    <Box w='150px'>
                      <img width='100%' h='auto' src={v.thumbnailUrl} />
                    </Box>

                    <Flex direction='column' p='2' w='100%'>
                      <Flex justify='space-between'>
                        <Heading size='sm'>{v.title}</Heading>
                        <HStack>
                          <ReprocessButton videoId={v.id} />
                        </HStack>
                      </Flex>

                      <HStack>
                        <Flex direction='column'>
                          <Text fontSize='.7rem'>Length</Text>
                          <Text>{duration(v.length)}</Text>
                        </Flex>

                        <Flex direction='column'>
                          <Text fontSize='.7rem'>Progress</Text>
                          <Text>{v.progress}</Text>
                        </Flex>

                        <Flex direction='column'>
                          <Text fontSize='.7rem'>Dimensions</Text>
                          <Text>{`${v.width} x ${v.height}`}</Text>
                        </Flex>

                        <Flex direction='column'>
                          <Text fontSize='.7rem'>Status</Text>
                          <Text>{v.status}</Text>
                        </Flex>

                        <Flex direction='column'>
                          <Text fontSize='.7rem'>Size</Text>
                          <Text>{`${v.size} MB`}</Text>
                        </Flex>

                        <Flex direction='column'>
                          <Text fontSize='.7rem'>Created</Text>
                          <Text>{DateTime.fromISO(v.createdAt).toRelative()}</Text>
                        </Flex>

                        <Flex direction='column'>
                          <Text fontSize='.7rem'>Updated</Text>
                          <Text>{DateTime.fromISO(v.updatedAt).toRelative()}</Text>
                        </Flex>
                      </HStack>
                    </Flex>
                  </Flex>

                  <Accordion allowToggle>
                    <AccordionItem>
                      <h2>
                        <AccordionButton>
                          <Box flex='1' textAlign='left'>
                            Details
                          </Box>
                          <AccordionIcon />
                        </AccordionButton>
                      </h2>
                      <AccordionPanel pb={4}>
                        <pre>{JSON.stringify(v, null, 2)}</pre>
                      </AccordionPanel>
                    </AccordionItem>
                  </Accordion>
                </Card>
              )
            })}
          </VStack>
        ) : (
          <Spinner />
        )}
      </Flex>
    </Layout>
  )
}

// {
//   "id": "cl50pq59w0277fnj5jan59dfx",
//   "size": 181,
//   "length": 30.618,
//   "views": 0,
//   "progress": 100,
//   "width": 2560,
//   "height": 1440,
//   "framerate": 60,
//   "type": "video/mp4",
//   "cdnUrl": "https://dev-cdn.bken.io/v/cl50pq59w0277fnj5jan59dfx",
//   "archivePath": "v/cl50pq59w0277fnj5jan59dfx/original.mp4",
//   "thumbnailUrl": "https://dev-cdn.bken.io/v/cl50pq59w0277fnj5jan59dfx/thumbnail.webp",
//   "title": "original",
//   "status": "READY",
//   "userId": "cl0b8y0xt0004yej5oqlbx11i",
//   "updatedAt": "2022-06-30T07:43:54.837Z",
//   "createdAt": "2022-06-30T07:36:07.988Z"
// }
