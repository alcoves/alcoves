import AccountMenu from '../components/account-menu'
import SidebarMenu from '../components/sidebar-menu'

import { useState } from 'react'
import { Menu } from 'lucide-react'
import { Button } from '../components/ui/button'
import { authenticator } from '../lib/auth.server'
import { getAlcoves } from '../lib/api.server.ts'
import { Outlet, useLoaderData, useMatches } from '@remix-run/react'
import { json, LoaderFunctionArgs } from '@remix-run/node'

import {
    Sheet,
    SheetTitle,
    SheetHeader,
    SheetTrigger,
    SheetContent,
    SheetDescription,
} from '../components/ui/sheet'

export async function loader({ request }: LoaderFunctionArgs) {
    const user = await authenticator.isAuthenticated(request)

    let alcoves
    if (user) {
        alcoves = await getAlcoves(request)
    }

    return json({ user, alcoves })
}

export default function AppRoot() {
    const matches = useMatches()
    const [isMenuOpen, setIsMenuOpen] = useState(true)
    const { user, alcoves } = useLoaderData<typeof loader>()
    const isVideoPage = matches.some((match) => match.id?.includes('$videoId'))

    const toggleMenu = () => {
        !isVideoPage ? setIsMenuOpen(!isMenuOpen) : null
    }

    return (
        <Sheet>
            <div className="flex flex-col w-screen h-screen">
                <div className="flex items-center justify-between p-2 h-12">
                    <div className="flex h-full items-center">
                        {isVideoPage ? (
                            <SheetTrigger asChild>
                                <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={toggleMenu}
                                >
                                    <Menu size={24} />
                                </Button>
                            </SheetTrigger>
                        ) : (
                            <Button
                                size="sm"
                                variant="ghost"
                                onClick={toggleMenu}
                                className="focus:outline-none"
                            >
                                <Menu size={24} />
                            </Button>
                        )}
                        <img width={32} height={32} src="/favicon.ico" />
                        <div className="pl-2 text-lg font-medium self-end hidden md:block">
                            Alcoves
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <AccountMenu user={user} />
                    </div>
                </div>
                <div className="flex flex-1">
                    {Boolean(isMenuOpen && !isVideoPage) && (
                        <aside className={`w-48 hidden md:block`}>
                            <SidebarMenu user={user} alcoves={alcoves || []} />
                        </aside>
                    )}
                    <main className="flex-1 p-4">
                        <Outlet />
                    </main>
                </div>
                <SheetContent side="left" className="w-60">
                    <SheetHeader>
                        <SheetTitle>
                            <div className="flex h-full items-center">
                                <img
                                    width={32}
                                    height={32}
                                    src="/favicon.ico"
                                />
                                <div className="pl-2 text-lg font-medium self-end">
                                    Alcoves
                                </div>
                            </div>
                        </SheetTitle>
                    </SheetHeader>
                    <SidebarMenu user={user} alcoves={alcoves || []} />
                </SheetContent>
            </div>
        </Sheet>
    )
}
