import UploadDialog from '../components/upload-dialog'

import { useLoaderData } from '@remix-run/react'
import { LoaderFunctionArgs } from '@remix-run/node'

export async function loader({ params }: LoaderFunctionArgs) {
    return params.alcoveId
}

export default function AlcovePage() {
    const alcoveId = useLoaderData()
    return (
        <div>
            <h1>{`Alcove Page for ${alcoveId}`}</h1>
            <UploadDialog alcoveId={alcoveId} />
        </div>
    )
}
