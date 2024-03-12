import Layout from '../components/Layout'
import { authenticator } from '../services/auth.server'
import { Outlet, useLoaderData } from '@remix-run/react'

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '../components/ui/breadcrumb'

export const meta: MetaFunction = () => {
  return [{ title: 'Admin' }, { name: 'description', content: 'Alcoves' }]
}

export async function loader({ request }: LoaderFunctionArgs) {
  const privateServer = false
  return await authenticator.isAuthenticated(request, {
    failureRedirect: privateServer ? '/login' : '',
  })
}

export default function AdminPage() {
  const user = useLoaderData<typeof loader>()

  return (
    <Layout user={user}>
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink href="/admin">Admin</BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          {/* <BreadcrumbItem>
            <BreadcrumbLink href="/admin/jobs">Jobs</BreadcrumbLink>
          </BreadcrumbItem> */}
        </BreadcrumbList>
      </Breadcrumb>
      <Outlet />
    </Layout>
  )
}
