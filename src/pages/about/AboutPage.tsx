import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { PageContainer } from '@/components/layout/page-container'

export function AboutPage() {
  return (
    <PageContainer title="Om Abakusrevyen" eyebrow="Hvem vi er" intro="En revy av og med studenter i linjeforeningen Abakus ved NTNU.">
      <div className="grid gap-8 lg:grid-cols-[2fr_1fr]">
        <div className="space-y-5 text-base leading-7 text-muted-foreground">
          <p>Hvert år samles en stor gjeng studenter for å skrive, bygge, spille, synge, danse og produsere en helt ny forestilling. Resultatet er Abakusrevyen.</p>
          <p>Revyen rommer mye mer enn det publikum ser på scenen. Gruppene jobber gjennom året med alt fra manus og kostymer til markedsføring, arrangement og teknikk.</p>
          <p>Denne siden er starten på den nye nettsiden vår. Mer informasjon om kommende forestillinger legges ut når den er klar for offentligheten.</p>
        </div>
        <aside className="rounded-lg border bg-card p-6 shadow-sm">
          <h2 className="font-heading text-xl font-semibold">Nysgjerrig på gruppene?</h2>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Se hva de forskjellige delene av revyen jobber med.</p>
          <Link to="/grupper" className="mt-5 inline-flex items-center gap-2 font-medium text-primary hover:underline">
            Se alle gruppene <ArrowRight className="size-4" aria-hidden="true" />
          </Link>
        </aside>
      </div>
    </PageContainer>
  )
}
