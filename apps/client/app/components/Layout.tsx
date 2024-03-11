import AccountMenu from './AccountMenu'
import SidebarMenu from './SidebarMenu'
import { Button } from './ui/button'
import { Upload } from 'lucide-react'
import { UserRecord } from '../services/auth.server'
import { Link } from '@remix-run/react'

export default function Layout(props: {
  user: UserRecord | null
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="flex items-center justify-between px-4 py-2 bg-white h-12">
        <Button variant="ghost" className="md:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </Button>
        <div className="flex align-middle justify-center">
          <img width={24} height={24} src="./favicon.ico" />
          <div className="pl-2 text-lg font-medium">Alcoves</div>
        </div>
        <div className="flex items-center">
          <Button size="sm" asChild className="mr-2">
            <Link to="/upload">
              <Upload size={18} className="mr-1" /> Upload
            </Link>
          </Button>
          <AccountMenu user={props.user} />
        </div>
      </header>
      <div className="flex flex-1">
        <aside className="w-48 hidden md:block">
          <SidebarMenu user={props.user} />
        </aside>
        <main className="flex-1 p-4">{props.children}</main>
      </div>
    </div>
  )
}
