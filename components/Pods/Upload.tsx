import axios from 'axios'
import { ChangeEvent, useEffect, useState } from 'react'
import { getApiUrl } from '../../utils/api'
import { fetchMutate } from '../../utils/fetcher'

interface UploadProps {
  podId: string
}

export function Upload(props: UploadProps): JSX.Element {
  const { podId } = props
  const [upload, setUpload] = useState<File | null>(null)

  function handleChange(e: ChangeEvent<HTMLInputElement>) {
    console.log('handle change', e.target.files)
    // eslint-disable-next-line
    // @ts-ignore
    setUpload(e?.target?.files[0])
  }

  async function uploadFile(file: File) {
    try {
      console.log('Begin Video Upload', file)
      // Create video returns a url to begin the upload
      const { data } = await fetchMutate({
        method: 'post',
        data: { title: upload?.name },
        url: `${getApiUrl()}/pods/${podId}/videos`,
      })

      // Upload file
      await axios.put(data, upload)
      console.log('file upload completed')
    } catch (error) {
      console.error(error)
    } finally {
      setUpload(null)
    }
  }

  useEffect(() => {
    if (upload) uploadFile(upload)
  }, [upload])

  return (
    <>
      <input
        type='file'
        multiple={false}
        accept='video/mp4'
        onChange={handleChange}
        disabled={Boolean(upload)}
      />
    </>
  )
}
