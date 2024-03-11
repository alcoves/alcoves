import { Outlet } from '@remix-run/react'

export default function AuthPage() {
  return (
    <div className="flex flex-col min-h-screen items-center justify-center space-y-4 p-4">
      <Outlet />
    </div>
  )
}
