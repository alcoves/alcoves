import {
  Box,
  Flex,
  Text,
  Switch,
  IconButton,
  useColorMode,
} from '@chakra-ui/react'
import { useUser } from '../../contexts/UserContext'
import { IoLogOutSharp } from 'react-icons/io5'

export default function Footer() {
  const { logout } = useUser()
  const currentYear = new Date().getFullYear()
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorMode().colorMode === 'dark' ? 'gray.800' : 'gray.200'

  return (
    <Flex bg={bg} direction="column" justify="center" align="center">
      <Flex align="center" w="100%" justify="space-evenly">
        <Flex w="100%" h="35px" justify="center" align="center">
          <Box
            w="100%"
            h="100%"
            rounded="none"
            variant="ghost"
            as={IconButton}
            onClick={logout}
            icon={<IoLogOutSharp size="1.2em" />}
          />
        </Flex>
        <Flex w="100%" justify="center">
          <Switch
            size="sm"
            id="color-mode"
            onChange={toggleColorMode}
            isChecked={colorMode === 'dark' ? true : false}
          />
        </Flex>
      </Flex>
      <Flex h="35px" align="center">
        <Text fontSize=".8rem">{`© ${currentYear}`}</Text>
      </Flex>
    </Flex>
  )
}
