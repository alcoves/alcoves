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
  Button,
} from '@chakra-ui/react'
import { DateTime } from 'luxon'
import {
  IoTimeOutline,
  IoCheckmarkDoneCircle,
  IoWarningOutline,
  IoInformationCircleOutline,
} from 'react-icons/io5'

export default function Jobs() {
  const { data } = useSWR('/jobs', {
    refreshInterval: 1000,
  })
  const bg = useColorModeValue('gray.100', 'gray.900')

  return (
    <Box>
      <Heading size="lg">Jobs</Heading>
      <Flex py="4">
        <Button size="sm">Cleanup</Button>
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
            {job?.returnvalue && (
              <Text>
                <Icon as={IoCheckmarkDoneCircle} /> Return Value:{' '}
                {job?.returnvalue}
              </Text>
            )}
            <Progress
              w="100%"
              size="xs"
              rounded="md"
              value={job.progress}
              max={5}
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
