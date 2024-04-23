import { authenticator } from '../lib/auth.server'
import { ActionFunctionArgs } from '@remix-run/node'

export default function AccountPage() {
    return <div>Here is my account</div>
}

export async function action({ request }: ActionFunctionArgs) {
    const privateServer = false

    const form = await request.formData()
    const action = form.get('action')

    if (action === 'logout') {
        return await authenticator.logout(request, {
            redirectTo: privateServer ? '/login' : '/',
        })
    }
}
