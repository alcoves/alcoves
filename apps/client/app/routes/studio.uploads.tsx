import { useState } from 'react'
import { Button } from '../components/ui/button'
import FileUpload from '../components/studio/FileUpload'

export default function StudioUpload() {
  // @uppy/aws-s3
  // https://uppy.io/docs/guides/choosing-uploader/#i-want-to-upload-to-aws-s3-or-s3-compatible-storage-directly
  // https://tus.github.io/tusd/storage-backends/aws-s3/

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null)

  const handleFileSelect = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = 'video/*'
    input.onchange = (event) => {
      const files = (event.target as HTMLInputElement)?.files
      setSelectedFiles(files)
    }
    input.click()
  }

  return (
    <div className="pt-5">
      <Button onClick={handleFileSelect}>Select a video file</Button>
      <div className="flex gap-2 py-2">
        {selectedFiles?.length &&
          Array.from(selectedFiles).map((file) => (
            <FileUpload key={file.name} file={file} />
          ))}
      </div>
    </div>
  )
}
