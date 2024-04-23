import ListAlcoves from './list-alcoves'

import { Button } from './ui/button'
import { SheetClose } from './ui/sheet'
import { Alcove } from '../lib/api.server.ts'
import { UserRecord } from '../lib/auth.server'
import { Home, SquarePlus } from 'lucide-react'
import { useLocation, useNavigate } from '@remix-run/react'

export function SidebarLink(props: {
    to: string
    extraClasses?: string
    children: React.ReactNode
}) {
    const navigate = useNavigate()
    const location = useLocation()

    return (
        <SheetClose asChild>
            <Button
                variant={location.pathname === props.to ? 'default' : 'ghost'}
                className="justify-start w-full"
                onClick={() => {
                    navigate(props.to)
                }}
            >
                {props.children}
            </Button>
        </SheetClose>
    )
}

export default function SidebarMenu(props: {
    user: UserRecord | null
    alcoves: Alcove[] | null
}) {
    if (props.user) {
        return (
            <div className="flex flex-col p-2 w-full gap-2">
                <SidebarLink to="/">
                    <Home className="mr-2 h-4 w-4" />
                    <div className="text-sm">Home</div>
                </SidebarLink>
                <SidebarLink to="/create">
                    <SquarePlus className="mr-2 h-4 w-4" />
                    <div className="text-sm">Create</div>
                </SidebarLink>
                <div>
                    <ListAlcoves alcoves={props.alcoves} />
                </div>
            </div>
        )
    }

    return null
}
