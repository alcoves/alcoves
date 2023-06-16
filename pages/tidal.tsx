import {
  Badge,
  Box,
  Flex,
  Heading,
  Progress,
  Stack,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
} from '@chakra-ui/react'
import Layout from '../components/Layout/Layout'
import { useQuery } from '@tanstack/react-query'
import { tidalGetJobs } from '../lib/api'
import { Job } from '../types/types'
import { DateTime, Duration } from 'luxon'
import { IoCheckmarkCircle } from 'react-icons/io5'

function QueueStats({ stats }: { stats: any }) {
  return (
    <Stack direction="row" pb="2">
      {Object.entries(stats).map(([key, value]) => {
        return (
          <Badge key={key} colorScheme="green">
            {key}: {value}
          </Badge>
        )
      })}
    </Stack>
  )
}

function RenderJobTab({ jobs }: { jobs: Job[] }) {
  const sortedByCreatedAt = jobs.sort((a: Job, b: Job) => {
    return b.timestamp - a.timestamp
  })

  return sortedByCreatedAt.map((j: Job) => {
    const processedAt = DateTime.fromMillis(j?.processedOn || 0)
    const finishedAt = DateTime.fromMillis(j?.finishedOn || 0)
    const startedAt = DateTime.fromMillis(j?.timestamp)

    const timeTaken = Duration.fromObject(
      finishedAt.diff(startedAt, ['minutes', 'seconds']).toObject()
    ).toHuman({
      unitDisplay: 'short',
    })

    return (
      <Flex w="100%" justify="space-between" key={j.id}>
        <Flex>
          <Flex pr="2" justify="center" align="center">
            {j.processedOn && !j.finishedOn ? (
              <Badge colorScheme="yellow">Processing</Badge>
            ) : null}
            {!j.processedOn && !j.finishedOn ? <Badge>Waiting</Badge> : null}
            {j?.failedReason ? <Badge colorScheme="red">Error</Badge> : null}
            {!j?.failedReason && j.finishedOn ? (
              <Badge colorScheme="green">Completed</Badge>
            ) : null}
          </Flex>
          <Text color="gray.400">{j.name}</Text>
          <Text px="2" color="gray.500">
            {j.id}
          </Text>
        </Flex>
        <Flex direction="row">
          <Text pr="2">{startedAt.toRelative()}</Text>
          {finishedAt.diff(startedAt).milliseconds > 0 ? (
            <Text pr="2"> Took: {timeTaken}</Text>
          ) : null}
          <Progress w="100px" rounded="sm" value={j.progress} />
        </Flex>
      </Flex>
    )
  })
}

export default function TidalPage() {
  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['tidal_jobs'],
    refetchInterval: 3000,
    queryFn: async (): Promise<unknown> => {
      const data = await tidalGetJobs()
      return data
    },
  })

  return (
    <Layout>
      <Flex w="100%" direction="column" p="4">
        <Heading>Tidal Jobs</Heading>
        <Tabs>
          <TabList>
            {data?.queues?.map((q) => {
              return (
                <Tab key={q}>
                  <Heading size="sm" textTransform="capitalize">
                    {q}
                  </Heading>
                </Tab>
              )
            })}
          </TabList>
          <TabPanels>
            {data?.queues?.map((q) => {
              const index = data.queues.indexOf(q)
              return (
                <TabPanel key={q}>
                  <QueueStats stats={data?.stats?.[index][q]['counts']} />
                  <RenderJobTab jobs={data?.jobs[index]} />
                </TabPanel>
              )
            })}
          </TabPanels>
        </Tabs>
      </Flex>
    </Layout>
  )
}
