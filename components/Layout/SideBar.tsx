import { Box, Button, VStack } from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { IoFilm, IoSearch } from 'react-icons/io5'

export default function SideBar() {
  const router = useRouter()

  return (
    <Box h="100%" w="200px" minW="200px" maxW="200px">
      <VStack spacing="2" pt="4" align="start">
        <Button
          w="90%"
          variant="ghost"
          borderLeftRadius={0}
          leftIcon={<IoFilm />}
          justifyContent="flex-start"
          onClick={() => {
            router.push('/')
          }}
        >
          Home
        </Button>
        <Button
          w="90%"
          variant="ghost"
          borderLeftRadius={0}
          leftIcon={<IoSearch />}
          justifyContent="flex-start"
          onClick={() => {
            router.push('/search')
          }}
        >
          Explore
        </Button>
      </VStack>
    </Box>
  )
}
