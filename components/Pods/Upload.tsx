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
        method: 'get',
        url: `${getApiUrl()}/pods/${podId}/videos/upload`,
      })

      // Upload file
      console.log('Signed URL fetched', data)
      await axios.put(data.url, upload) // Uploads to s3
      console.log('Upload to S3 complete')
      await fetchMutate({
        method: 'post',
        url: `${getApiUrl()}/pods/${podId}/videos/${data._id}`,
      }) // Enqueues jobs
      console.log('Jobs successfully enqueued')
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
