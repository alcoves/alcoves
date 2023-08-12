import useSWRMutation from 'swr/mutation'

import { useSWRConfig } from 'swr'
import { ChangeEvent } from 'react'
import { createVideo } from '../lib/api'
import { Button } from '@chakra-ui/react'
import { IoCloudUploadSharp } from 'react-icons/io5'

export default function Upload() {
  const { mutate } = useSWRConfig()
  const { trigger } = useSWRMutation('/videos', createVideo)

  async function handleUpload(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    await trigger(file)
    await mutate('/videos')
  }

  function handleClick(event: React.MouseEvent<HTMLInputElement>): void {
    // @ts-ignore
    event.target.value = ''
  }

  return (
    <>
      <input
        type="file"
        id="fileInput"
        onClick={handleClick}
        onChange={handleUpload}
        style={{ display: 'none' }}
        accept=".mp4,.mov,.avi,.mkv,.wmv,.flv,.webm,.mpeg,.mpg,.m4v"
      />
      <label htmlFor="fileInput">
        <Button as="span" cursor="pointer" leftIcon={<IoCloudUploadSharp />}>
          Upload
        </Button>
      </label>
    </>
  )
}
