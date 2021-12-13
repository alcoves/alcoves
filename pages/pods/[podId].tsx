import useSWR from 'swr'
import axios from '../../utils/axios'
import Layout from '../../components/Layout'
import Upload from '../../components/Upload'
import { useState } from 'react'
import { useRouter } from 'next/router'
import { fetcher } from '../../utils/axios'
import { AspectRatio, Box, Button, Flex, SimpleGrid, Text } from '@chakra-ui/react'

function PodMedia() {
  const router = useRouter()
  const { podId } = router.query
  const [selected, setSelected] = useState<number[]>([])
  const { data, mutate } = useSWR(
    podId ? `http://localhost:4000/media?podId=${podId}` : null,
    fetcher
  )

  async function deletePod() {
    try {
      await axios.delete(`http://localhost:4000/pods/${podId}`)
    } catch (error) {
      console.error(error)
    } finally {
      router.push('/')
    }
  }

  function handleClick(e: any, id: number) {
    if (e.shiftKey) {
      const index = selected.indexOf(id)
      console.log('shift detected', index)
      if (index > -1) {
        setSelected(prev => prev.filter(Id => Id !== id))
      } else {
        setSelected(prev => [...prev, id])
      }
    } else {
      console.log('just your standard old clickkywoo')
    }
  }

  async function deleteSelected() {
    try {
      await axios.delete('http://localhost:4000/media', {
        data: { ids: selected, podId },
      })
    } catch (error) {
      console.error(error)
    } finally {
      mutate()
      setSelected([])
    }
  }

  return (
    <Box w='100%'>
      <Button onClick={deleteSelected} isDisabled={!selected.length}>
        Delete Selected
      </Button>
      <Button onClick={deletePod} isDisabled={data?.payload?.media?.length}>
        Delete Pod
      </Button>
      <SimpleGrid minChildWidth='300px' spacing='8px'>
        {data?.payload?.media?.map((m: any) => {
          if (m.type.includes('image/')) {
            return (
              <Box
                id={m.id}
                key={m.id}
                cursor='pointer'
                direction='column'
                position='relative'
                onClick={e => handleClick(e, m.id)}
              >
                <Box
                  zIndex={1}
                  w='100%'
                  h='100%'
                  position='absolute'
                  _hover={{ bg: 'rgba(0,0,0,.1)' }}
                />
                <Box
                  w='100%'
                  h='300px'
                  rounded='sm'
                  backgroundSize='cover'
                  backgroundImage={m.url}
                  backgroundPosition='center'
                  backgroundRepeat='no-repeat'
                  border={selected.includes(m.id) ? 'solid teal 2px' : 'none'}
                ></Box>
              </Box>
            )
          } else if (m.type.includes('video/')) {
            // Show thumbnail URL
            return (
              <Box
                w='100%'
                h='300px'
                onClick={e => handleClick(e, m.id)}
                border={selected.includes(m.id) ? 'solid teal 2px' : 'none'}
              >
                <AspectRatio ratio={16 / 9}>
                  <video height='300' controls key={m.id} src={m.url} />
                </AspectRatio>
              </Box>
            )
          } else {
            return null
          }
        })}
      </SimpleGrid>
    </Box>
  )
}

export default function Pod() {
  const router = useRouter()
  const { podId } = router.query
  const { data, error } = useSWR(podId ? `http://localhost:4000/pods/${podId}` : null, fetcher)

  return (
    <Layout>
      <Flex direction='column' align='start' w='100%' px='4' pb='2'>
        <Upload />
        {data && !error && (
          <>
            <Text>{data?.payload?.pod?.id}</Text>
            <Text>{data?.payload?.pod?.name}</Text>
            <Text>{data?.payload?.pod?.image}</Text>
          </>
        )}
        <PodMedia />
      </Flex>
    </Layout>
  )
}
