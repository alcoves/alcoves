import { Button } from '~/components/ui/button'
import { json, useLoaderData } from '@remix-run/react'
import { Input } from '../components/ui/input'
import { Skeleton } from '../components/ui/skeleton'
import AccountMenu from '../components/AccountMenu'
import { authenticator } from '../services/auth.server'

import type {
  ActionFunctionArgs,
  LoaderFunctionArgs,
  MetaFunction,
} from '@remix-run/node'
import SidebarMenu from '../components/SidebarMenu'

export const meta: MetaFunction = () => {
  return [
    { title: 'Alcoves' },
    { name: 'description', content: 'Welcome to Alcoves!' },
  ]
}

export async function action({ request }: ActionFunctionArgs) {
  const form = await request.formData()
  const action = form.get('action')

  if (action === 'logout') {
    console.log('LOGOUT')
    return await authenticator.logout(request, {
      redirectTo: '/login',
    })
  }
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const user = await authenticator.isAuthenticated(request)
  return json({ user })
}

export default function Index() {
  const { user } = useLoaderData<typeof loader>()

  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-2 bg-white h-12">
        <Button variant="ghost" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
        <div className="flex align-middle justify-center">
          <img width={24} height={24} src="./favicon.ico" />
          <div className="pl-2 text-lg font-medium">Alcoves</div>
          {/* <Input type="text" placeholder="Search" className="w-1/2 h-8" /> */}
        </div>
        <AccountMenu user={user} />
      </header>
      <div className="flex flex-1">
        <aside className="w-48 hidden md:block">
          <SidebarMenu user={user} />
        </aside>
        <main className="flex-1 p-4">
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
        </main>
      </div>
    </div>
  )
}
