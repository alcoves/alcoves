import UserAccountMenuButton from '../../components/userAccountMenu'

import { ImageIcon, UsersIcon } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth'
import { Navigate, NavLink, Outlet } from 'react-router-dom'
import {
    Box,
    Flex,
    Image,
    IconButton,
    useColorModeValue,
} from '@chakra-ui/react'

export default function RootRoute() {
    const { user, isLoading } = useAuth()

    const sidebarBg = useColorModeValue('gray.50', 'gray.900')
    const contentBg = useColorModeValue('white', 'gray.800')

    if (!user && !isLoading) {
        console.info('RootRoute is redirecting to /auth/login')
        return <Navigate to="/auth/login" />
    }

    if (user) {
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
                        <NavLink to="/">
                            <Image src="/favicon.ico" alt="Logo" w="2rem" />
                        </NavLink>
                        <Flex mt="4" direction="column" gap="2">
                            <NavLink to="/">
                                {({ isActive }) => (
                                    <IconButton
                                        size="sm"
                                        aria-label="home"
                                        colorScheme={
                                            isActive ? 'green' : 'gray'
                                        }
                                        icon={<ImageIcon size="1rem" />}
                                    />
                                )}
                            </NavLink>
                            <NavLink to="/collections">
                                {({ isActive }) => (
                                    <IconButton
                                        size="sm"
                                        aria-label="home"
                                        colorScheme={
                                            isActive ? 'green' : 'gray'
                                        }
                                        icon={<UsersIcon size="1rem" />}
                                    />
                                )}
                            </NavLink>
                        </Flex>
                    </Flex>
                    <Flex
                        gap="2"
                        direction="column"
                        align="center"
                        justify="center"
                    >
                        <UserAccountMenuButton />
                    </Flex>
                </Flex>
                <Box bg={contentBg} w="100%" p="4" overflowY="auto">
                    <Outlet />
                </Box>
            </Flex>
        )
    }

    return null
}
