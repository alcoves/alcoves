import PodAvatar from './PodAvatar'
import useLazyRequest from '../../hooks/useLazyRequest'
import { useState } from 'react'
import { useSWRConfig } from 'swr'
import { IoSaveSharp } from 'react-icons/io5'
import { Flex, Input, Spinner, InputGroup, InputRightElement } from '@chakra-ui/react'

export default function PodName({ pod }: any) {
  const { mutate } = useSWRConfig()
  const [name, setName] = useState(pod?.name)
  const [updateName, { loading }] = useLazyRequest()

  async function handleName() {
    try {
      await updateName({
        data: { name },
        method: 'PATCH',
        url: `http://localhost:4000/pods/${pod?.id}`,
      })
    } catch (error) {
      console.error(error)
    } finally {
      mutate('http://localhost:4000/pods')
    }
  }

  return (
    <InputGroup size='sm'>
      <Input
        size='lg'
        variant='filled'
        defaultValue={pod?.name}
        onKeyUp={e => {
          if (e.key === 'Enter') {
            handleName()
          }
        }}
        onChange={e => {
          setName(e.target.value)
        }}
      />
      <InputRightElement h='100%' cursor='pointer' pr='4'>
        {name !== pod?.name ? (
          loading ? (
            <Spinner size='sm' />
          ) : (
            <IoSaveSharp onClick={handleName} color='green.500' size='20px' />
          )
        ) : null}
      </InputRightElement>
    </InputGroup>
  )
}
