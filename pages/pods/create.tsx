import Layout from '../../components/Layout'
import useLazyRequest from '../../hooks/useLazyRequest'
import {
  Box,
  Button,
  Flex,
  HStack,
  Heading,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { IoLockClosed } from 'react-icons/io5'
import { getAPIUrl } from '../../utils/urls'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'

export default function CreatePod() {
  const router = useRouter()
  const [podName, setPodName] = useState('')
  const [createPodRequest, { data, loading, error }] = useLazyRequest()

  function inputHandler(e: any) {
    setPodName(e.target.value)
  }

  async function handleCreate() {
    await createPodRequest({
      method: 'POST',
      data: { name: podName },
      url: `${getAPIUrl()}/pods`,
    })
  }

  useEffect(() => {
    if (data) {
      router.push(`/pods/${data.id}`)
    }
  }, [router, data])

  return (
    <Layout>
      <Flex w='100%' direction='column' align='center'>
        <Box w='600px'>
          <Heading size='lg' my='2'>
            Create Pod
          </Heading>

          <VStack spacing='2' align='start'>
            <Box>
              <Heading size='sm'>Name</Heading>
              <Text> Pod names can be changed later </Text>
            </Box>
            <Input
              variant='filled'
              value={podName}
              placeholder='Pod name'
              onChange={inputHandler}
              onKeyPress={(e: any) => {
                if (e?.key === 'Enter') {
                  handleCreate()
                }
              }}
            />
            <Box>
              <Heading size='sm'>Pod type</Heading>
            </Box>

            <RadioGroup defaultValue='1'>
              <Stack>
                <Radio size='md' value='1' colorScheme='teal' defaultChecked>
                  <HStack justify='center' align='center'>
                    <IoLockClosed size='15px' />
                    <Text> Private </Text>
                  </HStack>
                </Radio>
              </Stack>
            </RadioGroup>
          </VStack>

          <Flex w='100%' justify='end' mt='4' direction='column'>
            <Text my='2' color='red.500'>
              {error}
            </Text>
            <Button isLoading={loading} colorScheme='teal' onClick={handleCreate}>
              Create
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Layout>
  )
}
