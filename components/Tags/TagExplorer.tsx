import { apiUrl, getTags } from '../../lib/api'
import { Tag } from '../../types/types'
import { useRouter } from 'next/router'
import { Box, Flex, Heading, Image, SimpleGrid, Text } from '@chakra-ui/react'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'

export default function TagExplorer() {
  const router = useRouter()

  const { isLoading, isError, data, error } = useQuery({
    queryKey: ['tags'],
    queryFn: async (): Promise<{ tags: Tag[] }> => {
      const data = await getTags()
      return data
    },
  })

  function getRgbaFromString(str: string): string {
    // Generate a hash code from the string
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Extract 3 values from the hash code
    const r = (hash >> 8) & 0xff
    const g = (hash >> 4) & 0xff
    const b = hash & 0xff
    const a = 0.6

    // Construct the RGB value
    return `rgb(${r}, ${g}, ${b}, ${a})`
  }

  function getGradientFromString(str: string): string {
    // Generate a hash code from the string
    let hash = 0
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash)
    }

    // Extract 4 values from the hash code
    const r = (hash >> 16) & 0xff
    const g = (hash >> 8) & 0xff
    const b = hash & 0xff
    const a = 0.4

    // Construct the RGBA value
    // return `rgba(${r}, ${g}, ${b}, ${a})`

    // Adjust the RGB values to create a smaller range of color variation
    const r2 = (r + 16) % 256
    const g2 = (g + 32) % 256
    const b2 = (b + 48) % 256

    // Construct gradient colors
    const color1 = `rgb(${r}, ${g}, ${b}, ${a})`
    const color2 = `rgb(${r2}, ${g2}, ${b2}, ${a})`
    // Construct gradient string
    return `linear-gradient(to bottom right, ${color1}, ${color2})`
  }

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
                w="360px"
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
                  background={getRgbaFromString(tag.id)}
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
