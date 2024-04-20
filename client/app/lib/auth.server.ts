import { login } from './api'
import { FormStrategy } from 'remix-auth-form'
import { sessionStorage } from './session.server'
import { Authenticator, AuthorizationError } from 'remix-auth'

export interface UserRecord {
    email?: string
    username?: string
    session_id?: string
}

const authenticator = new Authenticator<UserRecord>(sessionStorage)

const formStrategy = new FormStrategy<UserRecord>(async ({ form }) => {
    const email = form.get('email') as string
    const password = form.get('password') as string

    const loginResponse = await login({ email, password }).catch(() => {
        throw new AuthorizationError('Invalid username or password')
    })

    return {
        email: email as string,
        username: email as string,
        session_id: loginResponse.session_id,
    }
})

authenticator.use(formStrategy)

export { authenticator }
