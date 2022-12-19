import { getVideo } from '../../../lib/tidal'
import Footer from '../../../components/Footer'
import Player from '../../../components/Players/Player'

export default async function VideoPage({ params }) {
  const video = await getVideo(params.videoId)

  return (
    <div className='min-h-screen flex flex-col items-center justify-between'>
      <Player video={video} />
      <Footer />
    </div>
  )
}
