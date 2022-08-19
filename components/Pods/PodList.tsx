import { Box, Spinner, SimpleGrid, Text, useColorModeValue } from '@chakra-ui/react'
import { useRouter } from 'next/router'

import { Pod } from '../../types/types'

export default function PodList({ pods = [] }: { pods: Pod[] }) {
  const router = useRouter()
  const bg = useColorModeValue('gray.100', 'gray.900')
  const hover = useColorModeValue('gray.200', 'gray.700')

  if (pods?.length === 0 || pods?.length) {
    return (
      <SimpleGrid columns={2} spacing={4}>
        {pods.map(pod => {
          return (
            <Box
              p='4'
              rounded='md'
              key={pod.id}
              bg={bg}
              cursor='pointer'
              _hover={{ bg: hover }}
              onClick={() => {
                router.push(`/pods/${pod.id}`)
              }}
            >
              <Text>{pod.name}</Text>
            </Box>
          )
        })}
      </SimpleGrid>
    )
  }

  return <Spinner />
}
