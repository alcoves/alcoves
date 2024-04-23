import ListAlcoves from './list-alcoves'

import { NavLink } from '@remix-run/react'
import { buttonVariants } from './ui/button'
import { Alcove } from '../lib/api.server.ts'
import { UserRecord } from '../lib/auth.server'
import { Home, SquarePlus } from 'lucide-react'

export function SidebarLink(props: {
    to: string
    extraClasses?: string
    children: React.ReactNode
}) {
    return (
        <NavLink
            to={props.to}
            className={({ isActive, isPending }) => {
                return `${buttonVariants({
                    variant: isActive ? 'default' : 'ghost',
                }).replace(
                    'justify-center',
                    'justify-start'
                )} ${props.extraClasses}`
            }}
        >
            {props.children}
        </NavLink>
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
