import { Outlet } from 'react-router'

export function AppLayout() {
  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-5 px-6 py-12">
      <Outlet />
    </main>
  )
}
