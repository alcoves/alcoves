import UploadDialog from '../components/upload-dialog'

import { useLoaderData } from '@remix-run/react'
import { authenticator } from '../lib/auth.server'
import { ActionFunctionArgs, LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ params, request }: LoaderFunctionArgs) {
    const user = await authenticator.isAuthenticated(request)

    return {
        user: user,
        alcoveId: params.alcoveId,
    }
}

export default function AlcovePage() {
    const { alcoveId, user } = useLoaderData<typeof loader>()
    return (
        <div>
            <h1>{`Alcove Page for ${alcoveId}`}</h1>
            <UploadDialog
                alcoveId={alcoveId || ''}
                sessionId={user?.session_id || ''}
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
