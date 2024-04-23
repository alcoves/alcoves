import UploadDialog from '../components/upload-dialog'

import { useLoaderData } from '@remix-run/react'
import { authenticator } from '../lib/auth.server'
import { ALCOVES_CLIENT_BROWSER_API_ENDPOINT } from '../lib/env'
import { ActionFunctionArgs, json, LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ params, request }: LoaderFunctionArgs) {
    const user = await authenticator.isAuthenticated(request)

    return json({
        user: user,
        alcoveId: params.alcoveId,
        ENV: {
            ALCOVES_CLIENT_BROWSER_API_ENDPOINT:
                ALCOVES_CLIENT_BROWSER_API_ENDPOINT,
        },
    })
}

export default function AlcovePage() {
    const { alcoveId, user, ENV } = useLoaderData<typeof loader>()
    return (
        <div>
            <h1>{`Alcove Page for ${alcoveId}`}</h1>
            <UploadDialog
                alcoveId={alcoveId || ''}
                sessionId={user?.session_id || ''}
                alcovesEndpoint={ENV.ALCOVES_CLIENT_BROWSER_API_ENDPOINT || ''}
            />
        </div>
    )
}

export async function action({ request }: ActionFunctionArgs) {
    const form = await request.formData()
    const action = form.get('action')

    console.log(form, action)

    if (action === 'create') {
        console.log('Creating upload', form.get('message'))
        // Create the upload
        return {
            url: 'here is the upload url',
        }
    } else if (action === 'complete') {
        // Complete the upload
        console.log('Completing upload')
    }

    return {
        message: 'No action',
    }
}
