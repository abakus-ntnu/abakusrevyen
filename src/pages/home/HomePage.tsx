import { ArrowRight, ExternalLink } from 'lucide-react'
import { Link } from 'react-router'
import { Button } from '@/components/ui/button'
import { getMediaUrl } from '@/features/media/media-url'

export function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-24 px-4 py-12 sm:px-6 sm:py-16 lg:px-8">
      <section className="flex flex-col items-center gap-6 text-center">
        <h1 className="font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Takk for i år!</h1>
        <div className="w-full max-w-5xl overflow-hidden rounded-lg bg-muted shadow-sm">
          <img
            src={getMediaUrl('images/gruppebilder/skal_skal_ikke.webp')}
            alt="Bilde av revymedlemmene etter Skal, skal ikke"
            className="aspect-[16/9] w-full object-cover"
          />
        </div>
        <p className="max-w-prose text-pretty leading-7 text-muted-foreground">Revyen er over for i år, men vi kommer tilbake enda sterkere neste år! Vi har hatt det utrolig gøy, og håper at dere likte revyen vår. Kom igjen!</p>
      </section>

      <section className="space-y-6">
        <div className="text-center">
          <p className="text-lg font-medium">Revyen <span className="text-primary">2026</span></p>
          <h2 className="mt-1 font-heading text-3xl font-semibold tracking-tight sm:text-4xl">Skal, skal ikke</h2>
          <a href="https://www.youtube.com/watch?v=bV8POVzQ7Fo&list=PLeAA7WakWMJqRvvVc10B9Pr5o_UG18xuX" target="_blank" rel="noreferrer" className="mt-3 inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground">
            Se på YouTube <ExternalLink className="size-4" aria-hidden="true" />
          </a>
        </div>

        <iframe
          className="mx-auto aspect-video w-full max-w-4xl rounded-lg bg-muted shadow-sm"
          src="https://www.youtube-nocookie.com/embed/bV8POVzQ7Fo"
          title="Skal, skal ikke – Abakusrevyen 2026"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />

        <div className="flex justify-center">
          <Button asChild variant="outline" size="lg">
            <Link to="/revyer">Se tidligere revyer <ArrowRight aria-hidden="true" /></Link>
          </Button>
        </div>
      </section>

      <section className="mx-auto max-w-3xl rounded-lg bg-card p-6 text-center shadow-sm ring-1 ring-border sm:p-8">
        <h2 className="font-heading text-2xl font-semibold">Vil du holde kontakten?</h2>
        <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-muted-foreground">Følg revyen, send oss en melding, eller finn opptaket når det er åpent.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild><Link to="/kontakt">Kontakt oss</Link></Button>
          <Button asChild variant="outline"><Link to="/opptak">Les om opptak</Link></Button>
        </div>
      </section>
    </div>
  )
}
