import { Link } from 'react-router-dom'
import { IoFilm } from 'react-icons/io5'
import { Box, Button, Heading, VStack } from '@chakra-ui/react'

export default function SideBar() {
  return (
    <Box h="100%" w="200px" minW="200px" maxW="200px">
      <VStack spacing="2" pt="4" align="start">
        <Heading
          fontSize=".6rem"
          pl="2"
          color="gray.500"
          textTransform="uppercase"
        >
          Assets
        </Heading>
        <Button
          as={Link}
          to="/"
          w="90%"
          size="sm"
          variant="ghost"
          borderLeftRadius={0}
          leftIcon={<IoFilm />}
          justifyContent="flex-start"
        >
          Home
        </Button>
        <Heading
          fontSize=".6rem"
          pl="2"
          color="gray.500"
          textTransform="uppercase"
        >
          Libraries
        </Heading>
        <Button
          as={Link}
          to="/"
          w="90%"
          size="sm"
          variant="ghost"
          borderLeftRadius={0}
          leftIcon={<IoFilm />}
          justifyContent="flex-start"
        >
          Gaming
        </Button>
        <Heading
          fontSize=".6rem"
          pl="2"
          color="gray.500"
          textTransform="uppercase"
        >
          Admin
        </Heading>
        <Button
          as={Link}
          to="/"
          w="90%"
          size="sm"
          variant="ghost"
          borderLeftRadius={0}
          leftIcon={<IoFilm />}
          justifyContent="flex-start"
        >
          Users
        </Button>
        <Button
          as={Link}
          to="/"
          w="90%"
          size="sm"
          variant="ghost"
          borderLeftRadius={0}
          leftIcon={<IoFilm />}
          justifyContent="flex-start"
        >
          Libraries
        </Button>
        <Button
          as={Link}
          to="/"
          w="90%"
          size="sm"
          variant="ghost"
          borderLeftRadius={0}
          leftIcon={<IoFilm />}
          justifyContent="flex-start"
        >
          Settings
        </Button>
      </VStack>
    </Box>
  )
}
