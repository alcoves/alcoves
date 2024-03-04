import { json } from '@remix-run/node'
import { Button } from '~/components/ui/button'
import { useLoaderData } from '@remix-run/react'
import { Avatar, AvatarFallback, AvatarImage } from '~/components/ui/avatar'

import type { MetaFunction } from '@remix-run/node'

export const meta: MetaFunction = () => {
  return [
    { title: 'Alcoves' },
    { name: 'description', content: 'Welcome to Alcoves!' },
  ]
}

export const loader = async () => {
  const response = await fetch('http://api:4000/health')
  const data = await response.json()

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
