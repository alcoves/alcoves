import usePods from '../../hooks/usePods'
import { useRouter } from 'next/router'
import { Avatar, Button, Text, VStack } from '@chakra-ui/react'

export default function PodsList() {
  const { data, isLoading } = usePods()
  const { push, query } = useRouter()

  if (!isLoading && data) {
    return (
      <VStack spacing='2' w='100%'>
        {data?.payload?.pods?.map((p: any) => {
          const variant = query.podId === p.id ? 'solid' : 'ghost'
          return (
            <Button
              px='2'
              w='100%'
              key={p.id}
              variant={variant}
              justifyContent='flex-start'
              leftIcon={<Avatar name={p.name} size='sm' />}
              onClick={() => {
                push(`/pods/${p.id}`)
              }}
            >
              <Text isTruncated>{p.name}</Text>
            </Button>
          )
        })}
      </VStack>
    )
  }

  return null
}
