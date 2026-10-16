import type { ReactNode } from 'react'
import { Mail, MapPin } from 'lucide-react'
import { Link } from 'react-router'
import { PageContainer } from '@/components/layout/page-container'
import { groups } from '@/features/groups/data/groups'
import { leaders } from '@/features/leaders/data/leaders'

const contacts = [
  { title: 'Revystyret', email: 'revystyret@abakus.no', description: 'Generelle spørsmål og henvendelser til revyen.' },
  { title: 'Revysjef', email: 'revysjef@abakus.no', description: 'Henvendelser som gjelder ledelse og samarbeid.' },
  { title: 'Hele revyen', email: 'revy-alle@abakus.no', description: 'Felles e-postliste for alle som er med i revyen.' },
]

export function ContactPage() {
  return (
    <PageContainer title="Kontakt oss" eyebrow="Si hei" intro="Har du spørsmål, en idé eller lyst til å samarbeide? Send oss gjerne en e-post.">
      <div className="grid gap-4 md:grid-cols-3">
        {contacts.map((contact) => (
          <a key={contact.email} href={`mailto:${contact.email}`} className="rounded-lg border bg-card p-6 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md">
            <Mail className="size-6 text-primary" aria-hidden="true" />
            <h2 className="mt-5 font-heading text-xl font-semibold">{contact.title}</h2>
            <p className="mt-2 text-sm leading-6 text-muted-foreground">{contact.description}</p>
            <p className="mt-5 break-all text-sm font-medium text-primary">{contact.email}</p>
          </a>
        ))}
      </div>
      <div className="mt-10 flex items-start gap-3 rounded-lg bg-muted/50 p-6 text-sm text-muted-foreground">
        <MapPin className="mt-0.5 size-5 shrink-0 text-primary" aria-hidden="true" />
        <p><strong className="text-foreground">Abakus Linjeforening</strong><br />c/o Abakus, Sem Sælands vei 7–9, 7491 Trondheim<br />Organisasjonsnummer 936 891 942</p>
      </div>
      <div className="mt-12 grid gap-8 lg:grid-cols-2">
        <ContactList title="Grupper" description="Ta kontakt direkte hvis spørsmålet gjelder en bestemt del av revyen">
          {groups.map((group) => (
            <ContactRow key={group.slug} href={`/grupper/${group.slug}`} name={group.name} detail={group.email} image={group.logo} />
          ))}
        </ContactList>
        <ContactList title="Ledere" description="Finn personen som leder gruppen eller området du vil kontakte">
          {leaders.map((leader) => (
            <ContactRow key={leader.slug} href={`/ledere/${leader.slug}`} name={leader.name} detail={leader.role} image={leader.image} />
          ))}
        </ContactList>
      </div>
    </PageContainer>
  )
}

function ContactList({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <section>
      <h2 className="font-heading text-2xl font-semibold">{title}</h2>
      <p className="mt-2 text-sm text-muted-foreground">{description}.</p>
      <div className="mt-5 divide-y overflow-hidden rounded-lg border bg-card shadow-sm">{children}</div>
    </section>
  )
}

function ContactRow({ href, name, detail, image }: { href: string; name: string; detail?: string | undefined; image?: string | undefined }) {
  return (
    <Link to={href} className="flex items-center gap-3 p-3 transition hover:bg-muted">
      {image ? <img src={image} alt="" loading="lazy" className="size-10 rounded-lg object-cover" /> : <span className="size-10 rounded-lg bg-muted" />}
      <span className="min-w-0"><span className="block font-medium">{name}</span>{detail ? <span className="block truncate text-xs text-muted-foreground">{detail}</span> : null}</span>
    </Link>
  )
}
