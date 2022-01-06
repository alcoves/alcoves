import dynamic from 'next/dynamic'

const ReactHlsPlayer = dynamic(() => import('react-hls-player'), { ssr: false })

export default function Player({ src }: { src: string }) {
  return <ReactHlsPlayer autoPlay={true} controls={true} width='100%' height='auto' src={src} />
}
