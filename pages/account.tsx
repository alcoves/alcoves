import {
  Avatar,
  Box,
  Button,
  Flex,
  HStack,
  Input,
  InputGroup,
  InputRightAddon,
  Text,
  useColorMode,
  VStack,
} from '@chakra-ui/react'
import { IoMoon, IoSunny } from 'react-icons/io5'

import Layout from '../components/Layout'
import { userStore } from '../stores/user'

export default function Account() {
  const { user, logout } = userStore()
  const { colorMode, toggleColorMode } = useColorMode()

  return (
    <Layout>
      <Flex p='2' justify='center'>
        <Flex w='400px' minW='400px' direction='column' align='center'>
          <Avatar size='lg' src={user?.image} />
          <VStack w='100%' spacing='2' my='2'>
            <InputGroup size='sm'>
              <Input
                isDisabled
                variant='filled'
                placeholder='Username'
                defaultValue={user?.username}
              />
              <InputRightAddon>
                <Text>Username</Text>
              </InputRightAddon>
            </InputGroup>
          </VStack>
          <HStack w='100%' spacing='2'>
            <Button
              w='100%'
              size='sm'
              onClick={toggleColorMode}
              leftIcon={colorMode === 'dark' ? <IoMoon /> : <IoSunny />}
            >
              Toggle Theme
            </Button>
            <Button
              w='100%'
              size='sm'
              onClick={() => {
                logout()
              }}
            >
              Logout
            </Button>
          </HStack>
        </Flex>
      </Flex>

      <Box></Box>
    </Layout>
  )
}
