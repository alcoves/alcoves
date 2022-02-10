import { useRouter } from 'next/router'
import { Pod } from '../../types/types'
import { Box, Heading, Wrap } from '@chakra-ui/react'

export default function Pods({ pods }: { pods: Pod[] }) {
  const router = useRouter()
  return (
    <Wrap>
      {pods.map((p: Pod) => {
        return (
          <Box key={p.id} cursor='pointer' onClick={() => router.push(`/pods/${p.id}`)}>
            <Box bg='black' w='300px' h='150px' rounded='md' p='2'>
              <Box>{p.id}</Box>
            </Box>
            <Heading my='2' size='sm'>
              {p.name}
            </Heading>
          </Box>
        )
      })}
    </Wrap>
  )
}
