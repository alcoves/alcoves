import React, { useRef, useState, useEffect } from 'react'

type VideoProps = {
  src: string
  width: number
  height: number
}

const ResizableVideo: React.FC<VideoProps> = ({ src, width, height }) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [aspectRatio, setAspectRatio] = useState(height / width)

  useEffect(() => {
    const handleResize = () => {
      const video = videoRef.current
      if (video) {
        setAspectRatio(video.clientHeight / video.clientWidth)
      }
    }

    const video = videoRef.current
    if (video) {
      video.addEventListener('loadedmetadata', handleResize)
      window.addEventListener('resize', handleResize)
      return () => {
        video.removeEventListener('loadedmetadata', handleResize)
        window.removeEventListener('resize', handleResize)
      }
    }
  }, [])

  const videoStyle = {
    width: '100%',
    height: `${aspectRatio * 100}%`,
    objectFit: 'cover',
  }

  return (
    <div
      style={{
        position: 'relative',
        width: '100%',
        paddingTop: `${aspectRatio * 100}%`,
      }}
    >
      <video
        ref={videoRef}
        src={src}
        width={width}
        height={height}
        autoPlay
        muted
        loop
      />
    </div>
  )
}

export default ResizableVideo
