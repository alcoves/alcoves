import Layout from '../components/layout'

import { Input } from '../components/ui/input'
import { Button } from '../components/ui/button'
import { Form, useLoaderData } from '@remix-run/react'
import { authenticator } from '../lib/auth.server'
import {
    ActionFunctionArgs,
    json,
    LoaderFunctionArgs,
    redirect,
} from '@remix-run/node'

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await authenticator.isAuthenticated(request)
    return json({ user })
}

export default function CreateAlcove() {
    const { user } = useLoaderData<typeof loader>()

    return (
        <div className="container mx-auto max-w-xl">
            <Form
                method="post"
                action="/alcoves/create"
                className="flex flex-col gap-2"
            >
                <div className="text-2xl">Create an alcove</div>
                <Input
                    required
                    id="name"
                    name="name"
                    placeholder="Your New Alcove!"
                />
                <Button type="submit">Create</Button>
            </Form>
        </div>
    )
}

export async function action({ request }: ActionFunctionArgs) {
    const form = await request.formData()
    const name = form.get('name') as string

    const user = await authenticator.isAuthenticated(request)
    console.log(`Creating alcove: ${name} from user : ${user?.username}`)

    // Create the alcove here

    return redirect('/')
}
