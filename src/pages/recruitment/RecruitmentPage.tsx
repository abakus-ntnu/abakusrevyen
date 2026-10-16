import { ExternalLink } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'

export function RecruitmentPage() {
  return (
    <PageContainer title="Bli med i revyen" eyebrow="Opptak" intro="Abakusrevyen trenger folk med mange forskjellige interesser og erfaringer.">
      <div className="max-w-3xl space-y-5 leading-7 text-muted-foreground">
        <p>Opptaket skjer gjennom Abakus sitt opptakssystem når søknadsperioden er åpen. Der finner du oppdatert informasjon om grupper og frister.</p>
        <a href="https://opptak.abakus.no/" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 font-medium text-primary hover:underline">Gå til opptak.abakus.no <ExternalLink className="size-4" aria-hidden="true" /></a>
      </div>
    </PageContainer>
  )
}
