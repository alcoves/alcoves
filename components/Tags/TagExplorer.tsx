import { apiUrl, getTags } from '../../lib/api'
import { Tag } from '../../types/types'
import { useRouter } from 'next/router'
import { Box, Flex, Heading, Image, SimpleGrid, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { getRgbaFromString } from '../../lib/util'

export default function TagExplorer() {
  const router = useRouter()

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async (): Promise<{ tags: Tag[] }> => {
      const data = await getTags()
      return data
    },
  })

  if (data?.tags?.length) {
    console.log({ data })
    const thumbnailId = data?.tags?.[0]?.videos?.[0]?.thumbnails?.[0]?.id
    const cardImageUrl = `${apiUrl}/videos/${data?.tags?.[0]?.videos?.[0]?.id}/thumbnails/${thumbnailId}`

    return (
      <Box w="100%" p="4">
        <Heading pb="4">Tags</Heading>
        <SimpleGrid minChildWidth="360px" spacing={2}>
          {data?.tags?.map((tag) => {
            const thumbnailId = tag?.videos?.[0].thumbnails?.[0]?.id
            const cardImageUrl = `${apiUrl}/videos/${tag.videos?.[0]?.id}/thumbnails/${thumbnailId}`
            return (
              <Flex
                as={Link}
                key={tag.id}
                minW="360px"
                h="200px"
                borderRadius="md"
                href={`/search/${tag.id}`}
                backgroundPosition="center"
                backgroundRepeat="no-repeat"
                backgroundSize={'cover'}
                backgroundImage={`url("${cardImageUrl}")`}
              >
                <Flex
                  w="100%"
                  h="100%"
                  align="center"
                  justify="center"
                  borderRadius="md"
                  backdropFilter={'blur(1px)'}
                  background={getRgbaFromString(tag.id, 0.6)}
                  _hover={{ background: getRgbaFromString(tag.id, 0.7) }}
                >
                  <Text
                    isTruncated
                    fontSize="1.3rem"
                    fontWeight="black"
                    textShadow="0 2px 4px rgba(0,0,0,.35)"
                  >
                    {tag.name}
                  </Text>
                </Flex>
              </Flex>
            )
          })}
        </SimpleGrid>
      </Box>
    )
  }

  return null
}
