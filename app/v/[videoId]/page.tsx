import { getVideo } from '../../../lib/tidal'
import Footer from '../../../components/Footer'
import Player from '../../../components/Player/Player'

export default async function VideoPage({ params }) {
  const video = await getVideo(params.videoId)

  return (
    <div className='h-screen flex flex-col items-center justify-between p-4'>
      <Player video={video} />
      <Footer />
    </div>
  )
}
