import { useLoaderData } from '@remix-run/react'
import { Button } from '../components/ui/button'
import { json, type MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
    return [{ title: 'Alcoves' }, { name: 'Alcoves', content: 'Alcoves' }]
}

interface Video {
    id: number
    title: string
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
                    <h2 className="text-3xl font-bold">Welcome to Alcoves</h2>
                    <Button size="sm">Upload</Button>
                    {videos.map((video) => (
                        <div key={video.id} className="">
                            {video.title}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}
