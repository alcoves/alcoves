import logo from '../assets/logo.png'
import { useLoaderData } from '@remix-run/react'
import UploadDialog from '../components/upload-dialog'
import { json, type MetaFunction } from '@remix-run/node'

import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'

export const meta: MetaFunction = () => {
    return [{ title: 'Alcoves' }, { name: 'Alcoves', content: 'Alcoves' }]
}

interface Video {
    id: number
    title: string
    url: string
}

export async function loader() {
    const response = await fetch('http://server:3005/videos')
    const data = await response.json()
    const videos: Video[] = data.videos
    return json({ videos })
}

export default function Index() {
    const { videos } = useLoaderData<typeof loader>()

    return (
        <div className="w-screen h-screen">
            <div className="container max-w-2xl p-4">
                <div className="flex flex-col items-center justify-center space-y-2">
                    <img height={128} width={128} src={logo} alt="logo" />
                    <h2 className="text-3xl font-bold">Alcoves</h2>
                    <UploadDialog />
                    <div className="flex flex-col space-y-2">
                        {videos?.map((video) => (
                            <div key={video.id}>
                                <MediaPlayer
                                    playsInline
                                    src={video.url}
                                    title={video.title}
                                >
                                    <MediaProvider />
                                    <DefaultVideoLayout
                                        icons={defaultLayoutIcons}
                                    />
                                </MediaPlayer>
                                <div className="text-lg font-bold">
                                    {video.title}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    )
}
