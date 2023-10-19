import useSWR from 'swr'
import { Box, Heading } from '@chakra-ui/react'

export default function ImagesPage() {
  const { data, isLoading } = useSWR('/images')

  return (
    <Box pt="10">
      <Heading size="md">Images</Heading>
      {!isLoading && data && (
        <Box>
          {data.map((image: any) => (
            <Box key={image.id} h="30px" border="solid gray 1px">
              {image.id}
            </Box>
          ))}
        </Box>
      )}
    </Box>
  )
}
