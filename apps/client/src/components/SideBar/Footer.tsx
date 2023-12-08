import {
  Box,
  Flex,
  Text,
  Switch,
  IconButton,
  useColorMode,
  useColorModeValue,
} from '@chakra-ui/react'
import { useUser } from '../../contexts/UserContext'
import { IoLogOutOutline } from 'react-icons/io5'

export default function Footer() {
  const { logout } = useUser()
  const currentYear = new Date().getFullYear()
  const { colorMode, toggleColorMode } = useColorMode()
  const bg = useColorModeValue('gray.200', 'gray.800')
  const border = useColorModeValue('gray.300', 'gray.900')

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
            borderTopWidth={0}
            borderLeftWidth={2}
            borderRightWidth={1}
            borderBottomWidth={2}
            borderColor={border}
            icon={<IoLogOutOutline size="1.3em" />}
          />
        </Flex>
        <Flex
          h="100%"
          w="100%"
          align="center"
          justify="center"
          borderTopWidth={0}
          borderLeftWidth={1}
          borderRightWidth={0}
          borderBottomWidth={2}
          borderColor={border}
        >
          <Switch
            size="sm"
            id="color-mode"
            onChange={toggleColorMode}
            isChecked={colorMode === 'dark' ? true : false}
          />
        </Flex>
      </Flex>
      <Flex
        h="35px"
        w="100%"
        align="center"
        justify="center"
        borderColor={border}
        borderTopWidth={0}
        borderLeftWidth={2}
        borderRightWidth={0}
        borderBottomWidth={2}
      >
        <Text fontSize=".8rem">{`© ${currentYear}`}</Text>
      </Flex>
    </Flex>
  )
}
