import useSWR from 'swr'
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
}

function getColorScheme(t: Task): string {
    if (t.progress === 100 && t.attemptsMade === 1) {
        return 'green'
    }

    if (t.attemptsMade > 1 && t.attemptsMade < 2) {
        return 'orange'
    }

    if (t.attemptsMade > 2) {
        return 'red'
    }

    if (t.progress > 0 && t.progress < 100) {
        return 'blue'
    }

    return 'gray'
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
                                    </Box>

                                    <Flex w="100%" justify="end">
                                        <Text fontSize=".75rem">
                                            {`ETA: ${
                                                task.data
                                                    .estimatedTimeRemaining ??
                                                'N/A'
                                            }`}
                                        </Text>
                                    </Flex>
                                    <Progress
                                        size="xs"
                                        rounded="md"
                                        value={task.progress}
                                        colorScheme={colorScheme}
                                    />
                                </CardBody>
                            </Card>
                        </Box>
                    )
                })}
            </Flex>
        </Box>
    )
}
