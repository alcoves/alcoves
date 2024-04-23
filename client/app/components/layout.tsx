import AccountMenu from './account-menu'
import SidebarMenu from './sidebar-menu'
import UploadDialog from './upload-dialog'

import { Menu } from 'lucide-react'
import { Button } from './ui/button'
import { Alcoves } from '../lib/api.server.ts'
import { UserRecord } from '../lib/auth.server'

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from './ui/sheet'

export default function Layout(props: {
    user: UserRecord | null
    alcoves: Alcoves[] | null
    children: React.ReactNode
}) {
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
                        <AccountMenu user={props.user} />
                    </div>
                </div>
                <div className="flex flex-1">
                    <aside className="w-48 hidden md:block">
                        <SidebarMenu
                            user={props.user}
                            alcoves={props.alcoves}
                        />
                    </aside>
                    <main className="flex-1 p-4">{props.children}</main>
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
                            <SidebarMenu
                                user={props.user}
                                alcoves={props.alcoves}
                            />
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </div>
        </Sheet>
    )
}
