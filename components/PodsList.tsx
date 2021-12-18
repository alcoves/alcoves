import usePods from '../hooks/usePods'
import { useRouter } from 'next/router'
import { IoPeople, IoStar } from 'react-icons/io5'
import { Box, Flex, Text, VStack } from '@chakra-ui/react'

export default function PodsList({ expanded }: any) {
  const { pods, isLoading } = usePods()
  const { push, query } = useRouter()

  if (!isLoading && pods) {
    return (
      <VStack spacing='1' w='100%'>
        {pods.map((p: any) => {
          const isSelected = query.podId === p.id ? true : false
          return (
            <Flex
              py='1'
              w='100%'
              key={p.id}
              rounded='sm'
              align='center'
              cursor='pointer'
              _hover={{ bg: 'gray.700' }}
              justifyContent={expanded ? 'flex-start' : 'center'}
              borderLeft={isSelected ? 'solid white 2px' : 'solid transparent 2px'}
              onClick={() => {
                push(`/pods/${p.id}`)
              }}
            >
              {p?.isDefault ? (
                <Box mx='2'>
                  <IoStar size='20px' color='#ffcc00' />
                </Box>
              ) : (
                <Box mx='2'>
                  <IoPeople size='20px' />
                </Box>
              )}
              {expanded && <Text>{p.name}</Text>}
            </Flex>
          )
        })}
      </VStack>
    )
  }

  return null
}
