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
        <div className="container mx-auto max-w-xl">
            <MediaPlayer
                playsInline
                src={video?.streams?.[0]?.url}
                title={video.title}
            >
                <MediaProvider />
                <DefaultVideoLayout icons={defaultLayoutIcons} />
            </MediaPlayer>
        </div>
    )
}

// export async function action({ request }: ActionFunctionArgs) {
//     const form = await request.formData()
//     const name = form.get('name') as string

//     const user = await authenticator.isAuthenticated(request)
//     console.log(`Creating alcove: ${name} from user : ${user?.username}`)

//     // Create the alcove here

//     return redirect('/')
// }
