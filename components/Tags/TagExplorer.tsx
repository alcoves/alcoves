import { getTags } from '../../lib/api'
import { Tag } from '../../types/types'
import { useRouter } from 'next/router'
import { Box, Heading, SimpleGrid, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'

export default function TagExplorer() {
  const router = useRouter()

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async (): Promise<{ tags: Tag[] }> => {
      const data = await getTags()
      return data
    },
  })

  function handleClick(e, tagName) {
    e.preventDefault()
    router.push(`search/${tagName}`)
  }

  if (data?.tags?.length) {
    return (
      <Box w="100%" p="4">
        <Heading pb="4">Tags</Heading>
        <SimpleGrid minChildWidth="200px" spacing={2}>
          {data?.tags?.map((tag) => {
            return (
              <Box
                p="2"
                key={tag.id}
                bg="gray.900"
                cursor="pointer"
                borderRadius="4"
                _hover={{ bg: 'blue.600' }}
                onClick={(e) => handleClick(e, tag.id)}
              >
                <Text fontSize=".9rem" isTruncated>
                  {tag.name}
                </Text>
              </Box>
            )
          })}
        </SimpleGrid>
      </Box>
    )
  }

  return null
}
