import { getVideo } from '../../../lib/tidal'

export default async function VideoHead({ params }) {
  const video = await getVideo(params.videoId)

  const publicURL = `https://bken.io/v/${params.videoId}`
  const ogDescription = 'Watch this video on bken.io'

  return video.progress === 100 ? (
    <>
      <title>{'bken.io'}</title>
      <meta property='og:title' content={video.id} />
      <meta property='og:type' content='website' />
      <meta property='og:url' content={publicURL} />
      <meta property='og:image' content={video.urls?.thumbnailUrl} />
      <meta property='og:image:type' content='image/avif' />
      <meta property='og:image:width' content='1280' />
      <meta property='og:image:height' content='720' />
      <meta property='og:image:alt' content='bken.io' />
      <meta name='description' content={ogDescription} />
      <meta property='og:description' content={ogDescription} />
      {/* Twitter tags */}
      <meta name='twitter:card' content='summary_large_image' />
      <meta property='twitter:url' content={publicURL} />
      <meta name='twitter:title' content={'bken.io'} />
      <meta name='twitter:description' content={ogDescription} />
      <meta name='twitter:image' content={video.urls?.thumbnailUrl} />
    </>
  ) : (
    <>
      <title>{'bken.io'}</title>
    </>
  )
}
