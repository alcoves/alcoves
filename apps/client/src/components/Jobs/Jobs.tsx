import CleanQueues from './CleanQueues'

import useSWR from 'swr'
import {
  Box,
  Card,
  Heading,
  Progress,
  VStack,
  Text,
  Icon,
  useColorModeValue,
  Flex,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import {
  IoTimeOutline,
  IoCheckmarkDoneCircle,
  IoWarningOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5'
import { useSSE } from '../../contexts/SSE'
import { useEffect } from 'react'

function JobReturnVale({ job }: { job: any }) {
  const bg = useColorModeValue('gray.200', 'gray.700')

  if (job.returnvalue) {
    return (
      <Accordion rounded="md" allowMultiple bg={bg}>
        <AccordionItem key={job.id} rounded="md">
          <AccordionButton>
            <Box as="span" flex="1" textAlign="left">
              Return Value
            </Box>
            <AccordionIcon />
          </AccordionButton>
          <AccordionPanel pb={2}>
            <Box overflow="auto" p="2" as="pre" borderRadius="md" bg={bg}>
              {JSON.stringify(job.returnvalue, null, 2)}
            </Box>
          </AccordionPanel>
        </AccordionItem>
      </Accordion>
    )
  }
  return null
}

export default function Jobs() {
  const { data: sseData } = useSSE()
  const { data, mutate } = useSWR('/api/jobs', { refreshInterval: 5000 })
  const bg = useColorModeValue('gray.100', 'gray.900')

  useEffect(() => {
    mutate()
  }, [sseData])

  return (
    <Box>
      <Heading size="lg">Jobs</Heading>
      <Flex py="4">
        <CleanQueues />
      </Flex>
      <VStack spacing="4">
        {data?.map((job: any) => (
          <Card
            key={job.id}
            w="100%"
            p="4"
            bg={bg}
            boxShadow="md"
            borderRadius="md"
          >
            <Heading size="md">{job.name}</Heading>
            <Heading size="sn">JobID: {job.id}</Heading>
            <Text>
              <Icon as={IoTimeOutline} /> Created:{' '}
              {DateTime.fromMillis(job.timestamp).toFormat('yyyy-MM-dd HH:mm')}
            </Text>
            {job.processedOn && (
              <Text>
                <Icon as={IoInformationCircleOutline} /> Processed:{' '}
                {DateTime.fromMillis(job.processedOn).toFormat(
                  'yyyy-MM-dd HH:mm'
                )}
              </Text>
            )}
            {job.finishedOn && (
              <Text>
                <Icon as={IoCheckmarkDoneCircle} /> Finished:{' '}
                {DateTime.fromMillis(job.finishedOn).toFormat(
                  'yyyy-MM-dd HH:mm'
                )}
              </Text>
            )}
            <JobReturnVale job={job} />
            <Progress
              mt="2"
              w="100%"
              size="xs"
              rounded="md"
              value={job.progress}
              borderBottomEndRadius="md"
            />
            {job.failedReason && (
              <Text color="red.500">
                <Icon as={IoWarningOutline} /> {job.failedReason}
              </Text>
            )}
          </Card>
        ))}
      </VStack>
    </Box>
  )
}
