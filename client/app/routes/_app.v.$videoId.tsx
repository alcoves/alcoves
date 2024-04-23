import { getVideo } from '../lib/api.server.ts'
import { useLoaderData } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/node'
import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'

export async function loader({ params, request }: LoaderFunctionArgs) {
    const { video } = await getVideo({ videoId: params.videoId ?? '' }, request)
    return json({ video })
}

export default function CreateAlcove() {
    const { video } = useLoaderData<typeof loader>()

    return (
        <div className="border-2">
            <div className="flex w-full justify-center">
                <div className="max-h-[calc(100vh-50vh)] object-contain w-full">
                    <MediaPlayer
                        className="h-auto w-100vw"
                        aspectRatio="16/9"
                        playsInline
                        load="visible"
                        posterLoad="visible"
                        // title={video.title}
                        src={video?.streams?.[0]?.url}
                    >
                        <MediaProvider />
                        <DefaultVideoLayout icons={defaultLayoutIcons} />
                    </MediaPlayer>
                </div>
            </div>
            <div className="container mx-auto max-w-lg">
                <div className="text-xl">{video.title}</div>
            </div>
        </div>
    )
}
