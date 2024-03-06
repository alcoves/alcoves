import { FormStrategy } from 'remix-auth-form'
import { sessionStorage } from './session.server'
import { Authenticator, AuthorizationError } from 'remix-auth'

interface UserRecord {
  id?: string
  role?: string
  email?: string
  username?: string
}

const authenticator = new Authenticator<UserRecord>(sessionStorage)

const formStrategy = new FormStrategy<UserRecord>(async ({ form }) => {
  const email = form.get('email')
  const password = form.get('password')

  // if (username === 'rusty@alcoves.io' && password === 'test') {
  //   return { id: '1' }
  //   // This is where we call the API to /login and recieve a token
  // }

  return {
    id: '1',
    role: 'admin',
    email: email as string,
    username: email as string,
  }

  throw new AuthorizationError('Invalid username or password')
})

authenticator.use(formStrategy)

export { authenticator }
