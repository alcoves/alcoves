import {
    Box,
    Flex,
    Button,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react'
import Tasks from './components/Tasks'

function Example() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <header>
            <Button onClick={toggleColorMode}>
                Toggle {colorMode === 'light' ? 'Dark' : 'Light'}
            </Button>
        </header>
    )
}

export default function App() {
    const sidebarBg = useColorModeValue('gray.50', 'gray.900')
    const contentBg = useColorModeValue('white', 'gray.800')

    return (
        <Flex w="100vw" h="100vh">
            <Box w="200px" bg={sidebarBg}>
                <Example />
            </Box>
            <Box bg={contentBg} w="100%" p="4" overflowY="auto">
                <Tasks />
            </Box>
        </Flex>
    )
}
