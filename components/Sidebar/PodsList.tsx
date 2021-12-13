import usePods from '../../hooks/usePods'
import { useRouter } from 'next/router'
import { Avatar, Button, Text, VStack } from '@chakra-ui/react'

export default function PodsList() {
  const { data, isLoading } = usePods()
  const { push, query } = useRouter()

  if (!isLoading && data) {
    return (
      <VStack spacing='2px' w='100%'>
        {data?.payload?.pods?.map((p: any) => {
          const variant = query.podId === p.id ? 'solid' : 'ghost'
          return (
            <Button
              w='100%'
              key={p.id}
              justifyContent='flex-start'
              variant={variant}
              onClick={() => {
                push(`/pods/${p.id}`)
              }}
            >
              <Avatar mr='2' name={p.name} size='xs' />
              <Text fontSize='.85rem'>{p.name}</Text>
            </Button>
          )
        })}
      </VStack>
    )
  }

  return null
}
