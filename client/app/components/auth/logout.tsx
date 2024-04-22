import { Form } from '@remix-run/react'

export default function LogoutButton() {
    return (
        <Form method="post" className="w-full">
            <button
                type="submit"
                name="action"
                value="logout"
                className="w-full"
            >
                Logout
            </button>
        </Form>
    )
}
