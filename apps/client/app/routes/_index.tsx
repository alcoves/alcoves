import { json } from '@remix-run/node'
import { Button } from '~/components/ui/button'
import { useLoaderData } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

import type { LoaderFunctionArgs, MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'Alcoves' },
    { name: 'description', content: 'Welcome to Alcoves!' },
  ]
}

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const response = await fetch('http://api:4000/health')
  const data = await response.json()

  // const cookieHeader = request.headers.get('Cookie')
  // const cookie = (await userToken.parse(cookieHeader)) || {}

  // if (cookie.token) {
  //   console.log('User Authentication Token', cookie.token)
  // } else {
  //   console.log('User is not authenticated')
  // }

  return json({
    message: data.message,
  })
}

export default function Index() {
  const rootMeassage = useLoaderData<typeof loader>()
  return (
    <div style={{ fontFamily: 'system-ui, sans-serif', lineHeight: '1.8' }}>
      <h1 className="text-3xl font-bold underline">Welcome to Alcoves</h1>
      <h4>{`Message from server: ${rootMeassage.message}`}</h4>
      <Avatar>
        <AvatarImage src="https://github.com/shadcn.png" />
        <AvatarFallback>CN</AvatarFallback>
      </Avatar>
      <Button>Click me</Button>
    </div>
  )
}
