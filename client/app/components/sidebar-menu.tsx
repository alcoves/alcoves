import { NavLink } from '@remix-run/react'
import { buttonVariants } from './ui/button'
import { UserRecord } from '../lib/auth.server'
import { Clapperboard, Home, Lock } from 'lucide-react'

function SidebarLink(props: { to: string; children: React.ReactNode }) {
    return (
        <NavLink
            to={props.to}
            className={({ isActive, isPending }) => {
                return `${buttonVariants({
                    variant: isActive ? 'default' : 'ghost',
                }).replace('justify-center', 'justify-start')}`
            }}
        >
            {props.children}
        </NavLink>
    )
}

export default function SidebarMenu(props: { user: UserRecord | null }) {
    if (props.user) {
        return (
            <div className="flex flex-col p-2 w-full gap-2">
                <SidebarLink to="/">
                    <Home className="mr-2 h-4 w-4" />
                    <div className="text-sm">Home</div>
                </SidebarLink>
            </div>
        )
    }

    return <div>Sidebar</div>
}
