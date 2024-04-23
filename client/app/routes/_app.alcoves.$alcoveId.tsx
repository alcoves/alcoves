import UploadDialog from '../components/upload-dialog'
import { ALCOVES_CLIENT_BROWSER_API_ENDPOINT } from '../lib/env'

import { getAlcove, getAlcoveVideos } from '../lib/api.server.ts'
import { useLoaderData } from '@remix-run/react'
import { authenticator } from '../lib/auth.server'
import AlcoveVideos from '../components/alcove-videos'
import { json, LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ params, request }: LoaderFunctionArgs) {
    const user = await authenticator.isAuthenticated(request)
    const alcove = await getAlcove({ alcoveId: params.alcoveId ?? '' }, request)
    const videos = await getAlcoveVideos(
        { alcoveId: params.alcoveId ?? '' },
        request
    )

    return json({
        user,
        alcove,
        videos,
        ENV: {
            ALCOVES_CLIENT_BROWSER_API_ENDPOINT:
                ALCOVES_CLIENT_BROWSER_API_ENDPOINT,
        },
    })
}

export default function AlcovePage() {
    const { alcove, videos, user, ENV } = useLoaderData<typeof loader>()
    return (
        <div className="p-2">
            <div className="text-2xl">{alcove.name}</div>
            <UploadDialog
                alcoveId={alcove.id || ''}
                sessionId={user?.session_id || ''}
                alcovesEndpoint={ENV.ALCOVES_CLIENT_BROWSER_API_ENDPOINT || ''}
            />
            <AlcoveVideos videos={videos.videos} />
        </div>
    )
}
