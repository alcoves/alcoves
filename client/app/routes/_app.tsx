import AccountMenu from '../components/account-menu'
import SidebarMenu from '../components/sidebar-menu'
import UploadDialog from '../components/upload-dialog'

import { Menu } from 'lucide-react'
import { Button } from '../components/ui/button'
import { authenticator } from '../lib/auth.server'
import { getAlcoves } from '../lib/api.server.ts'
import { Outlet, useLoaderData } from '@remix-run/react'
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
    const { user, alcoves } = useLoaderData<typeof loader>()

    return (
        <Sheet>
            <div className="flex flex-col w-screen h-screen">
                <div className="flex items-center justify-between p-2 h-12">
                    <div className="flex h-full items-center">
                        <SheetTrigger asChild>
                            <Button
                                size="sm"
                                variant="ghost"
                                className="md:hidden"
                            >
                                <Menu size={24} />
                            </Button>
                        </SheetTrigger>
                        <img width={32} height={32} src="/favicon.ico" />
                        <div className="pl-2 text-lg font-medium self-end hidden md:block">
                            Alcoves
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <UploadDialog />
                        <AccountMenu user={user} />
                    </div>
                </div>
                <div className="flex flex-1">
                    <aside className="w-48 hidden md:block">
                        <SidebarMenu user={user} alcoves={alcoves || []} />
                    </aside>
                    <main className="flex-1 p-4">
                        <Outlet />
                    </main>
                </div>
                <SheetContent side="left">
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
                        <SheetDescription>
                            <SidebarMenu user={user} alcoves={alcoves || []} />
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </div>
        </Sheet>
    )
}
