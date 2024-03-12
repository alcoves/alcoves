import AccountMenu from './AccountMenu'
import SidebarMenu from './SidebarMenu'
import { Button } from './ui/button'
import { Menu, Upload } from 'lucide-react'
import { UserRecord } from '../services/auth.server'
import { Link } from '@remix-run/react'
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
  children: React.ReactNode
}) {
  return (
    <Sheet>
      <div className="flex flex-col min-h-screen">
        <div className="flex items-center justify-between p-2 h-12">
          <div className="flex h-full items-center">
            <SheetTrigger>
              <Button size="sm" variant="ghost" className="md:hidden">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <img width={32} height={32} src="/favicon.ico" />
            <div className="pl-2 text-lg font-medium self-end hidden md:block">
              Alcoves
            </div>
          </div>
          <div className="flex items-center">
            <Button size="sm" asChild className="mr-2">
              <Link to="/studio/uploads">
                <Upload size={18} />
                <div className="ml-1 hidden md:block">Upload</div>
              </Link>
            </Button>
            <AccountMenu user={props.user} />
          </div>
        </div>
        <div className="flex flex-1">
          <aside className="w-48 hidden md:block">
            <SidebarMenu user={props.user} />
          </aside>
          <main className="flex-1 p-4">{props.children}</main>
        </div>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle>
              <div className="flex h-full items-center">
                <img width={32} height={32} src="/favicon.ico" />
                <div className="pl-2 text-lg font-medium self-end">Alcoves</div>
              </div>
            </SheetTitle>
            <SheetDescription>
              <SidebarMenu user={props.user} />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </div>
    </Sheet>
  )
}
