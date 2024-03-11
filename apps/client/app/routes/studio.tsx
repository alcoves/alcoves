import Layout from '../components/Layout'
import { authenticator } from '../services/auth.server'
import { Outlet, useLoaderData } from '@remix-run/react'

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb'

export const meta: MetaFunction = () => {
  return [
    { title: 'Studio' },
    { name: 'description', content: 'Alcoves Studio' },
  ]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const privateServer = false
  return await authenticator.isAuthenticated(request, {
    failureRedirect: privateServer ? '/login' : '',
  })
}

export default function StudioPage() {
  const user = useLoaderData<typeof loader>()

  return (
    <Layout user={user}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/studio">Studio</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink href="/studio/uploads">Uploads</BreadcrumbLink>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <Outlet />
    </Layout>
  )
}
