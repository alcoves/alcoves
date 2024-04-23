import { login } from './api.server.ts'
import { FormStrategy } from 'remix-auth-form'
import { sessionStorage } from './session.server'
import { Authenticator, AuthorizationError } from 'remix-auth'

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

        const loginResponse = await login(
            { username, password },
            request
        ).catch((error) => {
            console.error('Login error:', error)
            throw new AuthorizationError('Invalid username or password')
        })

        return {
            username: username as string,
            session_id: loginResponse.session_id,
        }
    }),
    'form'
)
