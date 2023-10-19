import useSWR from 'swr'
import {
  Box,
  Card,
  Flex,
  Heading,
  Image,
  VStack,
  useColorModeValue,
} from '@chakra-ui/react'

export default function ImagesPage() {
  const { data, isLoading } = useSWR('/images')

  const bg = useColorModeValue('gray.100', 'gray.700')
  return (
    <Box>
      <Heading size="lg">Images</Heading>
      {!isLoading && data && (
        <VStack>
          {data.map((image: any) => {
            const imageUrl = `http://localhost:4000/images/${image.id}.avif?q=75&w=100`
            return (
              <Card key={image.id} rounded="md" w="100%" bg={bg}>
                <Flex>
                  <Box rounded="lg">
                    <Image
                      rounded="md"
                      height="75px"
                      objectFit="cover"
                      src={imageUrl}
                      alt={image.id}
                    />
                  </Box>
                  <Box p="2">{image.id}</Box>
                </Flex>
              </Card>
            )
          })}
        </VStack>
      )}
    </Box>
  )
}
