import useLazyRequest from '../../hooks/useLazyRequest'
import { useSWRConfig } from 'swr'
import { Editable, EditablePreview, EditableInput } from '@chakra-ui/react'

export default function PodName({ pod }: any) {
  const { mutate } = useSWRConfig()
  const [updateName] = useLazyRequest()

  async function handleName(name: string) {
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
    <Editable
      fontSize='1.3rem'
      fontWeight='700'
      defaultValue={pod?.name}
      onSubmit={value => {
        if (value !== pod?.name) {
          handleName(value)
        }
      }}
    >
      <EditablePreview />
      <EditableInput />
    </Editable>
  )
}
