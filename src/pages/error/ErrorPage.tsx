import { isRouteErrorResponse, Link, useRouteError } from 'react-router'
import { Button } from '@/components/ui/button'

export function ErrorPage() {
  const error = useRouteError()
  const message = isRouteErrorResponse(error)
    ? error.statusText
    : 'Det oppstod en uventet feil.'

  return (
    <main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-5 px-6 py-12">
      <h1 className="text-3xl font-semibold tracking-tight">Noe gikk galt</h1>
      <p className="text-muted-foreground">{message}</p>
      <Button asChild className="self-start">
        <Link to="/">Til startsiden</Link>
      </Button>
    </main>
  )
}
