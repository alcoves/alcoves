import Layout from '../../components/Layout'
import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Input,
  Radio,
  RadioGroup,
  Stack,
  Text,
  VStack,
} from '@chakra-ui/react'
import { IoLockClosed } from 'react-icons/io5'
import { useState } from 'react'

export default function CreatePod() {
  const [podName, setPodName] = useState('')
  const [loading, setLoading] = useState(false)

  function inputHandler(e: any) {
    setPodName(e.target.value)
  }

  async function createPod() {
    try {
      setLoading(true)
    } catch (error) {
      setLoading(false)
    }
  }

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

          <Flex w='100%' justify='end' mt='4'>
            <Button isLoading={loading} colorScheme='teal' onClick={createPod}>
              Create
            </Button>
          </Flex>
        </Box>
      </Flex>
    </Layout>
  )
}
