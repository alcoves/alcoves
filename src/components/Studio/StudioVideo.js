import { useEffect, useRef, } from 'react';

let hls;

export default function StudioVideo({ data }) {
  const vRef = useRef(null);
  useEffect(() => {
    if (data?.hlsMasterLink) {
      const video = document.getElementById('bkenStudioVideoPlayer');
      hls = new window.Hls({ startLevel: 3 });
      hls.loadSource(data.hlsMasterLink);
      hls.attachMedia(video);
    }
  }, []);

  if (data.status !== 'completed') {
    const pc = parseInt(data.percentCompleted).toFixed(0)

    return (
      <div className='flex flex-col items-center rounded-md p-4'>
        <p className='text-xl text-gray-300 font-bold'>{data.status}</p>
        <p className='text-xl text-gray-300 font-bold'>{`${pc}%`}</p>
      </div>
    )
  }

  return (
    <video
      controls 
      ref={vRef}
      id='bkenStudioVideoPlayer'
      className='rounded-md max-h-96 min-h-96'
    />
  )
}