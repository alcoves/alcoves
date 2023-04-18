import React, { useState } from 'react'
import { writeFile } from 'fs/promises'
import { createFFmpeg, fetchFile } from '@ffmpeg/ffmpeg'

const ffmpeg = createFFmpeg({ log: true })

const ClipVideo: React.FC = () => {
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [startTime, setStartTime] = useState<number>(0)
  const [endTime, setEndTime] = useState<number>(0)

  const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setVideoFile(e.target.files[0])
    }
  }

  const handleClipVideo = async () => {
    if (!videoFile) {
      return
    }

    // Load FFmpeg Wasm
    await ffmpeg.load()

    // Read the video file
    const videoData = await fetchFile(videoFile)
    ffmpeg.FS('writeFile', 'input.mp4', videoData)

    // Clip the video
    const outputName = `output_${Date.now()}.mp4`
    await ffmpeg.run(
      '-i',
      'input.mp4',
      '-ss',
      startTime.toString(),
      '-to',
      endTime.toString(),
      '-c',
      'copy',
      outputName
    )

    // Get the clipped video
    const outputData = await fetchFile(outputName)

    // Create a new video file from the clipped video data
    const blob = new Blob([outputData.buffer], { type: 'video/mp4' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = outputName
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h2>Clip Video</h2>
      <input type="file" accept="video/*" onChange={handleVideoUpload} />
      <div>
        <label>Start Time:</label>
        <input
          type="number"
          value={startTime}
          onChange={(e) => setStartTime(parseInt(e.target.value))}
        />
      </div>
      <div>
        <label>End Time:</label>
        <input
          type="number"
          value={endTime}
          onChange={(e) => setEndTime(parseInt(e.target.value))}
        />
      </div>
      <button onClick={handleClipVideo}>Clip Video</button>
    </div>
  )
}

export default ClipVideo
