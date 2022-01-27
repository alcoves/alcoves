import dynamic from 'next/dynamic'
import { useRef } from 'react'

const ReactHlsPlayer = dynamic(() => import('react-hls-player'), { ssr: false })

export default function Player({ src }: { src: string }) {
  const ref = useRef(null)
  return (
    <ReactHlsPlayer
      playerRef={ref}
      autoPlay={true}
      controls={true}
      width='100%'
      height='auto'
      src={src}
    />
  )
}
