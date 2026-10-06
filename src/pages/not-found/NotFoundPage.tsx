import { Link } from 'react-router'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <>
      <h1 className="text-3xl font-semibold tracking-tight">Fant ikke siden</h1>
      <p className="text-muted-foreground">Siden finnes ikke.</p>
      <Button asChild className="self-start">
        <Link to="/">Til startsiden</Link>
      </Button>
    </>
  )
}
