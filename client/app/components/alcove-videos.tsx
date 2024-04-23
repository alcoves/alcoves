import { Video } from '../lib/api.server.ts'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'

export default function AlcoveVideos(props: { videos: Video[] }) {
    return (
        <div className="flex flex-wrap gap-4 pt-6">
            {props.videos?.map((video) => (
                <div key={video.id} className="w-full h-auto lg:w-96 lg:h-60">
                    <MediaPlayer
                        playsInline
                        src={video?.streams?.[0]?.url}
                        title={video.title}
                    >
                        <MediaProvider />
                        <DefaultVideoLayout icons={defaultLayoutIcons} />
                    </MediaPlayer>
                    <div className="text-md font-semibold">{video?.title}</div>
                </div>
            ))}
        </div>
    )
}
