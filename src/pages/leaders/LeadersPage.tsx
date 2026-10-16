import { ArrowLeft, Mail } from 'lucide-react'
import { Link, useParams } from 'react-router'
import { PageContainer } from '@/components/layout/page-container'
import { getLeader, leaders } from '@/features/leaders/data/leaders'

export function LeadersPage() {
  const { slug } = useParams()

  if (slug) {
    const leader = getLeader(slug)
    if (!leader) {
      return <PageContainer title="Fant ikke lederen" intro="Personen finnes ikke i den publiserte oversikten."><Link to="/ledere" className="inline-flex items-center gap-2 font-medium text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Til lederoversikten</Link></PageContainer>
    }

    return (
      <PageContainer title={leader.name} eyebrow="Revyledelsen 2027" intro={`${leader.role}${leader.group ? ` · ${leader.group}` : ''}`}>
        <div className="grid items-start gap-8 md:grid-cols-[18rem_1fr]">
          <img src={leader.image} alt={leader.name} className="aspect-[4/5] w-full rounded-lg object-cover shadow-sm" />
          <div className="space-y-5 leading-7 text-muted-foreground">
            <p>{leader.name} er {leader.role.toLocaleLowerCase('nb')} for 2027-revyen.</p>
            <a href={`mailto:${leader.email}`} className="inline-flex items-center gap-2 font-medium text-primary hover:underline"><Mail className="size-4" aria-hidden="true" /> {leader.email}</a>
            <div><Link to="/ledere" className="inline-flex items-center gap-2 font-medium text-primary hover:underline"><ArrowLeft className="size-4" aria-hidden="true" /> Til lederoversikten</Link></div>
          </div>
        </div>
      </PageContainer>
    )
  }

  const board = leaders.filter((leader) => leader.board)
  const groupLeaders = leaders.filter((leader) => !leader.board)

  return (
    <PageContainer title="Møt revyens ledere" eyebrow="Revyen 2027" intro="For å få revyen til å gå rundt må noen ta ansvar for å lede arbeidet.">
      <LeaderGrid leaders={board} featured />
      <div className="mx-auto my-12 max-w-2xl text-center">
        <h2 className="font-heading text-2xl font-semibold">Gruppeledere</h2>
        <p className="mt-3 leading-7 text-muted-foreground">Hver av revyens grupper har egne ledere som følger arbeidet gjennom året.</p>
      </div>
      <LeaderGrid leaders={groupLeaders} />
    </PageContainer>
  )
}

function LeaderGrid({ leaders: items, featured = false }: { leaders: typeof leaders; featured?: boolean }) {
  return (
    <div className={featured ? 'mx-auto grid max-w-4xl gap-5 sm:grid-cols-3' : 'grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4'}>
      {items.map((leader) => (
        <Link key={leader.slug} to={`/ledere/${leader.slug}`} className="group overflow-hidden rounded-lg border bg-card shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
          <img src={leader.image} alt={leader.name} loading="lazy" className="aspect-[4/5] w-full object-cover transition duration-300 group-hover:scale-[1.02]" />
          <div className="p-4">
            <h2 className="font-heading font-semibold leading-tight">{leader.name}</h2>
            <p className="mt-1 text-sm font-medium text-primary">{leader.role}</p>
            {leader.group ? <p className="mt-1 text-xs text-muted-foreground">{leader.group}</p> : null}
          </div>
        </Link>
      ))}
    </div>
  )
}
