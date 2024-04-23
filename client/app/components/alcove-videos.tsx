import { Video } from '../lib/api.server.ts'
import { useNavigate } from '@remix-run/react'

export default function AlcoveVideos(props: { videos: Video[] }) {
    const navigate = useNavigate()
    return (
        <div className="flex flex-wrap gap-4 pt-6">
            {props.videos?.map((video) => (
                <div
                    key={video.id}
                    className="w-full h-auto lg:w-96 lg:h-60 border-2 cursor-pointer"
                    onClick={() => {
                        navigate(`/v/${video.id}`)
                    }}
                >
                    <div className="text-md font-semibold">{video?.title}</div>
                </div>
            ))}
        </div>
    )
}
