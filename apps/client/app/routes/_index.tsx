import { Skeleton } from '../components/ui/skeleton'
import { authenticator } from '../services/auth.server'

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import Layout from '../components/Layout'
import { useLoaderData } from '@remix-run/react'

export const meta: MetaFunction = () => {
  return [
    { title: 'Alcoves' },
    { name: 'description', content: 'Welcome to Alcoves!' },
  ]
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
  const privateServer = false
  return await authenticator.isAuthenticated(request, {
    failureRedirect: privateServer ? '/login' : '',
  })
}

export default function Index() {
  const user = useLoaderData<typeof loader>()

  return (
    <Layout user={user}>
      <div className="flex-1 p-4">
        <div>Favorite Videos</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
        <div>Recent Videos</div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-64" />
          ))}
        </div>
      </div>
    </Layout>
  )
}
