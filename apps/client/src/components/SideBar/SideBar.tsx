import { NavLink } from 'react-router-dom'
import {
  IoCogOutline,
  IoHomeOutline,
  IoFileTrayFull,
  IoConstructOutline,
} from 'react-icons/io5'
import {
  Box,
  Button,
  Flex,
  Heading,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'
import Footer from './Footer'
import Header from './Header'

export default function SideBar() {
  const bg = useColorModeValue('gray.100', 'gray.900')
  const border = useColorModeValue('gray.300', 'gray.900')
  const activeLinkStyles = {
    bgColor: useColorModeValue('gray.300', 'gray.700'),
  }

  return (
    <Flex
      bg={bg}
      h="100%"
      w="210px"
      minW="210px"
      maxW="210px"
      direction="column"
      borderColor={border}
      borderRightWidth={2}
      justify="space-between"
    >
      <Box>
        <Header />
        <VStack spacing="2" pt="4" align="start">
          <Button
            as={NavLink}
            to="/"
            w="90%"
            size="sm"
            variant="ghost"
            borderLeftRadius={0}
            leftIcon={<IoHomeOutline size="1.5em" />}
            justifyContent="flex-start"
            _activeLink={activeLinkStyles}
          >
            Dashboard
          </Button>
          <Heading
            mt="2"
            pl="2"
            fontSize=".6rem"
            color="gray.500"
            textTransform="uppercase"
          >
            Media
          </Heading>
          <Button
            as={NavLink}
            to="/assets"
            w="90%"
            size="sm"
            variant="ghost"
            borderLeftRadius={0}
            leftIcon={<IoFileTrayFull size="1.5em" />}
            justifyContent="flex-start"
            _activeLink={activeLinkStyles}
          >
            Assets
          </Button>
          <Heading
            mt="2"
            pl="2"
            fontSize=".6rem"
            color="gray.500"
            textTransform="uppercase"
          >
            Configuration
          </Heading>
          <Button
            as={NavLink}
            to="/jobs"
            w="90%"
            size="sm"
            variant="ghost"
            borderLeftRadius={0}
            leftIcon={<IoCogOutline size="1.5em" />}
            justifyContent="flex-start"
            _activeLink={activeLinkStyles}
          >
            Jobs
          </Button>
          <Button
            as={NavLink}
            to="/settings"
            w="90%"
            size="sm"
            variant="ghost"
            borderLeftRadius={0}
            leftIcon={<IoConstructOutline size="1.5em" />}
            justifyContent="flex-start"
            _activeLink={activeLinkStyles}
          >
            Settings
          </Button>
        </VStack>
      </Box>
      <Footer />
    </Flex>
  )
}
