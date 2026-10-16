import { ArrowLeft, Mail } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { PageContainer } from '@/components/layout/page-container'
import { getGroup } from '@/features/groups/data/groups'
import { getMediaUrl } from '@/features/media/media-url'

export function GroupPage() {
  const { slug } = useParams()
  const group = getGroup(slug)

  if (!group) {
    return (
      <PageContainer title="Fant ikke gruppen" intro="Gruppen finnes ikke, eller adressen er utdatert.">
        <Link to="/grupper" className="inline-flex items-center gap-2 font-medium text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Tilbake til gruppene</Link>
      </PageContainer>
    )
  }

  return (
    <PageContainer title={group.name} eyebrow="Gruppe" intro={group.description}>
      <div className="grid items-start gap-8 lg:grid-cols-[1fr_18rem]">
        <div className="space-y-5 leading-7 text-muted-foreground">
          <p>Her kommer mer informasjon om gruppen når den er gjennomgått og oppdatert for årets revy. Den korte beskrivelsen er hentet fra offentlig materiale på den gamle nettsiden.</p>
          <Link to="/grupper" className="inline-flex items-center gap-2 font-medium text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Alle grupper</Link>
          {group.email ? <a href={`mailto:${group.email}`} className="ml-6 inline-flex items-center gap-2 font-medium text-primary hover:underline"><Mail className="size-4" aria-hidden="true" /> {group.email}</a> : null}
        </div>
        <div className="flex aspect-square items-center justify-center rounded-lg border bg-card p-10 shadow-sm">
          <img src={group.logo ?? getMediaUrl('images/revy-logo.webp')} alt={`Logo for ${group.name}`} className="max-h-full max-w-full object-contain" />
        </div>
      </div>
    </PageContainer>
  )
}
