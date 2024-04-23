import logo from '../assets/logo.png'
import { useLoaderData } from '@remix-run/react'
import UploadDialog from '../components/upload-dialog'
import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    type MetaFunction,
} from '@remix-run/node'

import { MediaPlayer, MediaProvider } from '@vidstack/react'
import {
    defaultLayoutIcons,
    DefaultVideoLayout,
} from '@vidstack/react/player/layouts/default'
import { authenticator } from '../lib/auth.server'
import Layout from '../components/layout'
import { getAlcoves } from '../lib/api.server.ts'

export const meta: MetaFunction = () => {
    return [
        { title: 'Alcoves' },
        { name: 'description', content: 'Welcome to Alcoves!' },
    ]
}

interface Video {
    id: number
    title: string
    url: string
    streams: { url: string }[]
}

export async function action({ request }: ActionFunctionArgs) {
    const privateServer = false

    const form = await request.formData()
    const action = form.get('action')

    if (action === 'logout') {
        return await authenticator.logout(request, {
            redirectTo: privateServer ? '/login' : '/',
        })
    }
}

export async function loader({ request }: LoaderFunctionArgs) {
    const privateServer = true
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: privateServer ? '/login' : '',
    })

    const alcoves = await getAlcoves(request)
    return json({ user, alcoves })
}

export default function Index() {
    const { user, alcoves } = useLoaderData<typeof loader>()

    return (
        <Layout user={user} alcoves={alcoves}>
            <div className="flex flex-col space-y-2 max-w-3xl">
                {/* {videos?.map((video) => (
                    <div key={video.id}>
                        <MediaPlayer
                            playsInline
                            title={video.title}
                            src={video.streams[0].url}
                        >
                            <MediaProvider />
                            <DefaultVideoLayout icons={defaultLayoutIcons} />
                        </MediaPlayer>
                        <div className="text-lg font-bold truncate">
                            {video.title}
                        </div>
                    </div>
                ))} */}
            </div>
        </Layout>
    )
}
