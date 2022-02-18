import { useRouter } from 'next/router'
import { Pod } from '../../types/types'
import { Avatar, Box, Flex, Heading } from '@chakra-ui/react'

export default function Pods({ pods }: { pods: Pod[] }) {
  const router = useRouter()
  return (
    <Flex direction='column' align='center' w='100%'>
      {pods.map((p: Pod) => {
        return (
          <Flex key={p.id} cursor='pointer' onClick={() => router.push(`/pods/${p.id}`)} p='2'>
            <Avatar name={p.name} />
            <Flex direction='column'>
              <Box>{p.id}</Box>
              <Heading my='2' size='sm'>
                {p.name}
              </Heading>
            </Flex>
          </Flex>
        )
      })}
    </Flex>
  )
}
