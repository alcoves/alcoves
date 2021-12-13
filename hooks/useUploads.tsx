import axios from '../utils/axios'
import chunkFile from '../utils/chunkFile'
import { useState } from 'react'
import { Upload, UploadsState } from '../types/types'

const bypassInterceptorAxios = axios.create()

export default function useUploads(): UploadsState {
  const [uploads, setUploads] = useState<Upload[]>([])

  function updateUpload(name: string, update: any) {
    const index = uploads.findIndex(u => {
      return u?.file?.name === name
    })
    if (index) {
      uploads[index] = { ...uploads[index], ...update }
      // Force an update
    }
  }

  async function addUpload(file: File) {
    try {
      // Add new upload
      setUploads((prev: any) => [...prev, { file, status: 'started' }])
      const chunks = chunkFile(file)

      // Get signedURLS
      const { data } = await axios.post('http://localhost:4000/uploads', {
        chunks: chunks.length,
        contentType: file.type,
      })

      console.log('createUploadRes data', data.payload)
      const urls: string[] = data?.payload?.upload?.urls || []

      await Promise.all(
        chunks.map((chunk, i) => {
          console.log(`uploading part ${i} to ${urls[i]}`)
          // let lastBytesLoaded = 0
          return bypassInterceptorAxios.put(urls[i], chunk, {
            onUploadProgress: e => {
              console.log(e.loaded)
              // const deltaUploaded = e.loaded - lastBytesLoaded
              // setBytesUploaded(p => p + deltaUploaded)
              // lastBytesLoaded = e.loaded
            },
          })
        })
      )

      await axios.post('http://localhost:4000/media', {
        key: data?.payload?.upload.key,
        uploadId: data?.payload?.upload.uploadId,
      })
    } catch (error) {
      console.log(`failed to upload ${file}`)
      updateUpload(file.name, { status: 'failed' })
    } finally {
      updateUpload(file.name, { status: 'completed' })
    }
  }

  return { uploads, addUpload }
}
