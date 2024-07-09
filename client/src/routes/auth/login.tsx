import { FaGoogle } from 'react-icons/fa'
import { useGoogleLogin } from '@react-oauth/google'
import {
    Button,
    Flex,
    Heading,
    Image,
    Link,
    useColorModeValue,
} from '@chakra-ui/react'
import { GOOGLE_REDIRECT_URL } from '../../lib/env'

export default function Login() {
    const contentBg = useColorModeValue('white', 'gray.800')

    const loginWithGoogle = useGoogleLogin({
        flow: 'auth-code',
        ux_mode: 'redirect',
        redirect_uri: GOOGLE_REDIRECT_URL,
        onSuccess: (tokenResponse) => {
            console.log(tokenResponse)
        },
        onError: () => {
            console.log('Login Failed')
        },
    })

    return (
        <Flex
            w="100vw"
            h="100vh"
            bg={contentBg}
            align="center"
            justify="center"
        >
            <Flex
                p="4"
                w="100%"
                maxW="350px"
                align="center"
                justify="center"
                direction="column"
            >
                <Image src="/favicon.ico" alt="Logo" w="4rem" />
                <Heading size="md" py="4">
                    Login or Sign up
                </Heading>
                <Button
                    w="100%"
                    leftIcon={<FaGoogle />}
                    onClick={() => {
                        loginWithGoogle()
                    }}
                >
                    Continue with Google
                </Button>
                <Flex
                    py="2"
                    pr="2"
                    gap="4"
                    w="100%"
                    justify="end"
                    fontSize=".7em"
                    fontWeight="bold"
                >
                    <Link href="/privacy">{`Privacy`}</Link>
                    <Link href="/terms">{`Terms`}</Link>
                </Flex>
            </Flex>
        </Flex>
    )
}
