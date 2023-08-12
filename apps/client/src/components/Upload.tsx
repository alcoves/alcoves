import useSWRMutation from 'swr/mutation'

import { useSWRConfig } from 'swr'
import { createVideo } from '../lib/api'
import { Button } from '@chakra-ui/react'
import { IoCloudUploadSharp } from 'react-icons/io5'

export default function Upload() {
  const { mutate } = useSWRConfig()
  const { trigger } = useSWRMutation('/videos', createVideo)

  async function handleCreate() {
    await trigger()
    await mutate('/videos')
  }

  return (
    <>
      <Button onClick={handleCreate} leftIcon={<IoCloudUploadSharp />}>
        Upload
      </Button>
    </>
  )
}
