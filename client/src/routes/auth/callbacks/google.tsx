import { useEffect } from 'react'
import { API_URL } from '../../../lib/env'

export default function GoogleAuthorizationCallback() {
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search)
        const code = urlParams.get('code')
        console.log('code', code)

        console.log('Access Code', code)
        fetch(`${API_URL}/api/auth/google`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                code,
            }),
        })
            .then((response) => {
                console.log(response)
            })
            .catch((error) => {
                console.error(error)
            })
    }, [])

    return <div>Loading...</div>
}
