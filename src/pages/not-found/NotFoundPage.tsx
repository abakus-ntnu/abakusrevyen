import { Link } from 'react-router'
import { PageContainer } from '@/components/layout/page-container'
import { Button } from '@/components/ui/button'

export function NotFoundPage() {
  return (
    <PageContainer title="Fant ikke siden" intro="Siden finnes ikke, eller adressen har blitt endret.">
      <Button asChild className="self-start">
        <Link to="/">Til startsiden</Link>
      </Button>
    </PageContainer>
  )
}
