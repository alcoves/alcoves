import LogoutButton from './auth/logout'

import { Button } from './ui/button'
import { Link } from '@remix-run/react'
import { UserRecord } from '../lib/auth.server'
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar'

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from './ui/dropdown-menu'

export default function AccountMenu(props: { user: UserRecord | null }) {
    if (props.user) {
        return (
            <DropdownMenu>
                <DropdownMenuTrigger>
                    <Avatar className="w-8 h-8">
                        <AvatarImage src="" />
                        <AvatarFallback>
                            {props?.user?.username?.[0]?.toUpperCase() ?? ''}
                        </AvatarFallback>
                    </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                    <DropdownMenuLabel>
                        Hi {props.user.username}
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                        <Link to="/account">My Account</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                        <LogoutButton />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        )
    }

    return (
        <Link to="/login">
            <Button size="sm" variant="secondary">
                Log In
            </Button>
        </Link>
    )
}
