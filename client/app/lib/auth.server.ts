import { Authenticator } from 'remix-auth'
import { FormStrategy } from 'remix-auth-form'
import { sessionStorage } from './session.server'
import { ALCOVES_CLIENT_API_ENDPOINT } from './env'

export interface UserRecord {
    email?: string
    username?: string
    session_id?: string
}

export const authenticator = new Authenticator<UserRecord>(sessionStorage)

authenticator.use(
    new FormStrategy<UserRecord>(async (request) => {
        const username = request.form.get('username') as string
        const password = request.form.get('password') as string

        try {
            const response = await fetch(
                `${ALCOVES_CLIENT_API_ENDPOINT}/auth/login`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ username, password }),
                }
            )
            if (!response.ok) {
                throw new Error(`Request failed with status ${response.status}`)
            }
            const data = await response.json()
            return {
                username: username as string,
                session_id: data.session_id,
            }
        } catch (error) {
            throw new Error(`API request failed: ${error}`)
        }
    }),
    'form'
)
