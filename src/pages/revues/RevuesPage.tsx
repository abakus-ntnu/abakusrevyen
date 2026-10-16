import { ExternalLink } from 'lucide-react'
import { PageContainer } from '@/components/layout/page-container'
import { revues } from '@/features/revues/data/revues'

export function RevuesPage() {
  return (
    <PageContainer title="Tidligere revyer" eyebrow="Arkivet" intro="Et tilbakeblikk på revyene vi har laget siden 2017.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {revues.map((revue) => (
          <article key={revue.year} className="flex min-h-72 flex-col rounded-lg border bg-card p-6 shadow-sm">
            <div className="flex flex-1 items-center justify-center rounded-xl bg-muted/40 p-8">
              <img src={revue.logo} alt={`${revue.title}-logo`} className="max-h-28 max-w-full object-contain" />
            </div>
            <p className="mt-5 text-sm font-medium text-primary">{revue.year}</p>
            <h2 className="font-heading text-xl font-semibold">{revue.title}</h2>
            <div className="mt-3 flex flex-wrap gap-x-4 gap-y-2">
              {revue.videos.map((video) => <a key={video.url} href={video.url} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-medium text-primary hover:underline">{video.label} <ExternalLink className="size-4" aria-hidden="true" /></a>)}
            </div>
          </article>
        ))}
      </div>
    </PageContainer>
  )
}
