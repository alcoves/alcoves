import { loader } from '../../routes/_index'
import { ActionFunction } from '@remix-run/node'
import { authenticator } from '../../lib/auth.server'
import { Form, Link, useLoaderData } from '@remix-run/react'

const action: ActionFunction = async ({ request }) => {
  // const user = await authenticator.isAuthenticated(request, {
  //   failureRedirect: '/login',
  // })

  const form = await request.formData()
  const action = form.get('action')

  if (action === 'logout') {
    return await authenticator.logout(request, {
      redirectTo: '/',
    })
  }
}

export default function LogoutButton() {
  // const { user } = useLoaderData<typeof loader>()
  // console.log('Here is the user in the logout button', user)

  return (
    <Form method="post">
      <button
        type="submit"
        name="action"
        value="logout"
        className="bg-white text-black border-2 border-black py-1 px-3 rounded-md font-semibold"
      >
        Logout
      </button>
    </Form>
  )
}

export { action }
