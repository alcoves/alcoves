import { NavLink } from 'react-router-dom'
import { IoFilm, IoHomeSharp, IoCameraSharp } from 'react-icons/io5'
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
            leftIcon={<IoHomeSharp />}
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
            Assets
          </Heading>
          <Button
            as={NavLink}
            to="/images"
            w="90%"
            size="sm"
            variant="ghost"
            borderLeftRadius={0}
            leftIcon={<IoCameraSharp />}
            justifyContent="flex-start"
            _activeLink={activeLinkStyles}
          >
            Images
          </Button>
          <Button
            as={NavLink}
            to="/videos"
            w="90%"
            size="sm"
            variant="ghost"
            borderLeftRadius={0}
            leftIcon={<IoFilm />}
            justifyContent="flex-start"
            _activeLink={activeLinkStyles}
          >
            Videos
          </Button>
        </VStack>
      </Box>
      <Footer />
    </Flex>
  )
}
