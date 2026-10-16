import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router'
import { PageContainer } from '@/components/layout/page-container'
import { groups } from '@/features/groups/data/groups'
import { getMediaUrl } from '@/features/media/media-url'

export function GroupsPage() {
  return (
    <PageContainer title="Gruppene våre" eyebrow="Bak scenen" intro="Abakusrevyen blir til når mange forskjellige fag og interesser jobber mot samme forestilling.">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {groups.map((group) => (
          <Link key={group.slug} to={`/grupper/${group.slug}`} className="group flex min-h-52 flex-col rounded-lg border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
            <img src={group.logo ?? getMediaUrl('images/revy-logo.webp')} alt="" className="mb-6 size-16 object-contain" />
            <h2 className="font-heading text-xl font-semibold">{group.name}</h2>
            <p className="mt-2 flex-1 text-sm leading-6 text-muted-foreground">{group.description}</p>
            <span className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-primary">Les mer <ArrowRight className="size-4 transition group-hover:translate-x-1" aria-hidden="true" /></span>
          </Link>
        ))}
      </div>
    </PageContainer>
  )
}
