import {
    Flex,
    Alert,
    AlertTitle,
    AlertDescription,
    useColorModeValue,
} from '@chakra-ui/react'
import { AlertCircle } from 'lucide-react'
import { useRouteError } from 'react-router-dom'

export default function ErrorPage() {
    const error = useRouteError()
    console.error(error)

    const contentBg = useColorModeValue('white', 'gray.800')

    return (
        <Flex
            w="100vw"
            h="100vh"
            pt="20"
            bg={contentBg}
            align="center"
            id="error-page"
            direction="column"
        >
            <Flex direction="column" w="100%" maxW="500px">
                <Alert
                    status="error"
                    rounded="md"
                    flexDirection="column"
                    alignItems="flex-start"
                    gap="1"
                >
                    <Flex>
                        <AlertCircle />
                        <AlertTitle pl="2">Something went wrong</AlertTitle>
                    </Flex>
                    <AlertDescription>
                        Error:{' '}
                        {(error as { statusText?: string })?.statusText ||
                            (error as { message?: string })?.message ||
                            'Unknown error'}
                    </AlertDescription>
                </Alert>
            </Flex>
        </Flex>
    )
}
