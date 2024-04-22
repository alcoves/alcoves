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
}

export async function action({ request }: ActionFunctionArgs) {
    const privateServer = false

    const form = await request.formData()
    const action = form.get('action')

    if (action === 'logout') {
        console.log('LOGOUT')
        return await authenticator.logout(request, {
            redirectTo: privateServer ? '/login' : '/',
        })
    }
}

export async function loader({ request }: LoaderFunctionArgs) {
    const response = await fetch(
        `${process.env.ALCOVES_CLIENT_API_ENDPOINT || ''}/videos`
    )
    const data = await response.json()
    const videos: Video[] = data.videos

    const privateServer = true
    const user = await authenticator.isAuthenticated(request, {
        failureRedirect: privateServer ? '/login' : '',
    })

    return json({ user, videos })
}

export default function Index() {
    const { user, videos } = useLoaderData<typeof loader>()

    return (
        <Layout user={user}>
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
        </Layout>
    )
}
