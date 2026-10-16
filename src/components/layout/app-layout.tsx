import { useEffect } from 'react'
import { Outlet, useMatches } from 'react-router'
import { SiteFooter } from '@/components/layout/site-footer'
import { SiteHeader } from '@/components/layout/site-header'

type RouteHandle = {
  title?: string
}

export function AppLayout() {
  const matches = useMatches()
  const title = [...matches]
    .reverse()
    .map((match) => (match.handle as RouteHandle | undefined)?.title)
    .find(Boolean)

  useEffect(() => {
    document.title = title ? `${title} | Abakusrevyen` : 'Abakusrevyen'
  }, [title])

  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <SiteFooter />
    </div>
  )
}
