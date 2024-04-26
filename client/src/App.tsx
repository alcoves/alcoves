import Tasks from './components/Tasks'

import { LayoutList, Moon, Sun } from 'lucide-react'

import {
    Box,
    Flex,
    IconButton,
    Image,
    useColorMode,
    useColorModeValue,
} from '@chakra-ui/react'

function ColorModeToggle() {
    const { colorMode, toggleColorMode } = useColorMode()
    return (
        <header>
            <IconButton
                size="sm"
                aria-label="Theme"
                onClick={toggleColorMode}
                icon={
                    colorMode === 'light' ? (
                        <Moon size="1rem" />
                    ) : (
                        <Sun size="1rem" />
                    )
                }
            ></IconButton>
        </header>
    )
}

export default function App() {
    const sidebarBg = useColorModeValue('gray.50', 'gray.900')
    const contentBg = useColorModeValue('white', 'gray.800')

    return (
        <Flex w="100vw" h="100vh">
            <Flex
                p="2"
                w="50px"
                h="100%"
                bg={sidebarBg}
                align="center"
                direction="column"
                justify="space-between"
            >
                <Flex align="center" justify="center" direction="column">
                    <a href="/">
                        <Image src="/favicon.ico" alt="Logo" w="2rem" />
                    </a>
                    <Flex mt="4">
                        <IconButton
                            size="sm"
                            aria-label="tasks"
                            colorScheme={
                                window?.location?.pathname === '/'
                                    ? 'green'
                                    : 'gray'
                            }
                            variant={
                                window?.location?.pathname === '/'
                                    ? 'solid'
                                    : 'solid'
                            }
                            icon={<LayoutList size="1rem" />}
                        />
                    </Flex>
                </Flex>
                <Flex align="center" justify="center">
                    <ColorModeToggle />
                </Flex>
            </Flex>
            <Box bg={contentBg} w="100%" p="4" overflowY="auto">
                <Tasks />
            </Box>
        </Flex>
    )
}
