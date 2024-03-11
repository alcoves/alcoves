import { Clapperboard, Home } from 'lucide-react'
import { NavLink } from '@remix-run/react'
import { buttonVariants } from './ui/button'
import { UserRecord } from '../services/auth.server'

function SidebarLink(props: { to: string; children: React.ReactNode }) {
  return (
    <NavLink
      to={props.to}
      className={({ isActive, isPending }) => {
        return `${buttonVariants({
          variant: isActive ? 'default' : 'ghost',
        })}`
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
        <SidebarLink to="/studio">
          <Clapperboard className="mr-2 h-4 w-4" />
          <div className="text-sm">Studio</div>
        </SidebarLink>
      </div>
    )
  }

  return <div>Sidebar</div>
}
