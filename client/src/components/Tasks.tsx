import useSWR from 'swr'
import { DateTime, Interval } from 'luxon'
import { fetcher } from '../lib/swr'
import {
    Box,
    Card,
    CardBody,
    Flex,
    Heading,
    Progress,
    Text,
    useColorModeValue,
} from '@chakra-ui/react'
import TaskCounts from './TaskCounts'

type Task = {
    name: string
    data: {
        input: string
        output: string
        commands: string
        estimatedTimeRemaining: string
    }
    opts: {
        attempts: number
        delay: number
    }
    id: string
    progress: number
    returnvalue: unknown
    stacktrace: unknown[]
    attemptsStarted: number
    attemptsMade: number
    delay: number
    timestamp: number
    queueQualifiedName: string
    finishedOn: number
    processedOn: number
    failedReason?: string
}

function getColorScheme(t: Task): string {
    if (t.progress === 100 && t.attemptsMade === 1) {
        return 'green'
    }

    if (t.attemptsMade > 1 && t.attemptsMade < 2) {
        return 'orange'
    }

    if (t.attemptsMade > 2 || t?.failedReason) {
        return 'red'
    }

    if (t?.failedReason) {
        return 'red'
    }

    if (t.progress > 0 && t.progress < 100) {
        return 'blue'
    }

    return 'gray'
}

function timeAgo(date: number) {
    if (!date) return 'N/A'

    const now = DateTime.local()
    const past = DateTime.fromMillis(date)
    const diff = now.diff(past, ['days', 'hours', 'minutes']).normalize()

    let output = ''
    if (diff.days > 0) {
        output = `${diff.days.toFixed(1)} day${diff.days !== 1 ? 's' : ''} ago`
    } else if (diff.hours > 0) {
        output = `${diff.hours.toFixed(1)} hour${
            diff.hours !== 1 ? 's' : ''
        } ago`
    } else if (diff.minutes > 0) {
        output = `${diff.minutes.toFixed(1)} minute${
            diff.minutes !== 1 ? 's' : ''
        } ago`
    } else {
        output = 'just now'
    }

    return output
}

function calculateDuration(start: number, end: number) {
    if (!start) return 'N/A'
    if (!end) end = Date.now()

    const dateTime1 = DateTime.fromMillis(start)
    const dateTime2 = DateTime.fromMillis(end)

    const interval = Interval.fromDateTimes(dateTime1, dateTime2)
    const duration = interval.toDuration([
        'days',
        'hours',
        'minutes',
        'seconds',
    ])

    const parts = []
    if (duration.days > 0) {
        parts.push(`${duration.days} day${duration.days !== 1 ? 's' : ''}`)
    }
    if (duration.hours > 0) {
        parts.push(`${duration.hours} hour${duration.hours !== 1 ? 's' : ''}`)
    }
    if (duration.minutes > 0) {
        parts.push(
            `${duration.minutes} minute${duration.minutes !== 1 ? 's' : ''}`
        )
    }
    if (duration.minutes < 10) {
        parts.push(
            `${duration.seconds.toFixed(1)} second${
                duration.seconds !== 1 ? 's' : ''
            }`
        )
    }

    if (parts.length === 0) {
        return 'N/A' // Or some other default message for no time difference
    }

    return parts.join(' and ') + ''
}

export default function Tasks() {
    const cardBg = useColorModeValue('white', 'gray.900')
    const cardCodeBg = useColorModeValue('gray.50', 'gray.800')

    const { data, error, isLoading } = useSWR('/tasks', fetcher, {
        refreshInterval: 1000,
    })

    if (error) return <Box>failed to load</Box>
    if (isLoading) return <Box>loading...</Box>

    return (
        <Box>
            <Heading mb="4">Tasks</Heading>

            <TaskCounts />

            <Flex direction="column" gap="4">
                {data?.tasks?.map((task: Task) => {
                    const colorScheme = getColorScheme(task)

                    return (
                        <Box key={task.id}>
                            <Card bg={cardBg}>
                                <CardBody>
                                    <Heading size="sm">
                                        Task Name: {task.name}
                                    </Heading>
                                    <Box
                                        p="2"
                                        my="2"
                                        rounded="md"
                                        bg={cardCodeBg}
                                        fontFamily="monospace"
                                    >
                                        <Text>Task ID: {task.id}</Text>
                                        <Box>
                                            {JSON.stringify(task.data, null, 2)}
                                        </Box>
                                        {task?.failedReason && (
                                            <Box pt="2" color="red.500">
                                                {task?.failedReason}
                                            </Box>
                                        )}
                                    </Box>

                                    <Flex w="100%" justify="space-between">
                                        <Box>
                                            <Text fontSize=".75rem">
                                                {`Started: ${timeAgo(
                                                    task.timestamp
                                                )}`}
                                            </Text>
                                            <Text fontSize=".75rem">
                                                {`Time Taken: ${calculateDuration(
                                                    task.processedOn,
                                                    task.finishedOn
                                                )}`}
                                            </Text>
                                        </Box>
                                        <Flex direction="column" align="end">
                                            <Text fontSize=".75rem">
                                                {`ETA: ${
                                                    task.data
                                                        .estimatedTimeRemaining ??
                                                    'N/A'
                                                }`}
                                            </Text>
                                            <Text fontSize=".85rem" pl="2">
                                                {`${
                                                    task.progress
                                                        ? `${task.progress}% `
                                                        : '0%'
                                                }`}
                                            </Text>
                                        </Flex>
                                    </Flex>
                                    <Flex align="center">
                                        <Progress
                                            w="100%"
                                            size="xs"
                                            rounded="md"
                                            value={task.progress}
                                            colorScheme={colorScheme}
                                        />
                                    </Flex>
                                </CardBody>
                            </Card>
                        </Box>
                    )
                })}
            </Flex>
        </Box>
    )
}
