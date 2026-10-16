import { ArrowUpRight, ExternalLink, Mail } from 'lucide-react'
import { Link } from 'react-router'
import { primaryNavigation, utilityNavigation } from '@/app/navigation'

const socialLinks = [
  { label: 'Facebook', href: 'https://facebook.com/Abakusrevyen', icon: ExternalLink },
  { label: 'Instagram', href: 'https://instagram.com/abakusrevyen', icon: ExternalLink },
  { label: 'YouTube', href: 'https://www.youtube.com/@abakusrevyen', icon: ExternalLink },
]

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t bg-muted/30">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-10 sm:px-6 md:grid-cols-[1fr_auto] lg:px-8">
        <div className="max-w-sm space-y-2">
          <p className="font-heading text-xl font-semibold">Abakusrevyen</p>
          <p className="text-sm text-muted-foreground">Av studenter, for studenter.</p>
          <p className="text-xs text-muted-foreground">Org.nr. 936 891 942</p>
        </div>

        <div className="flex flex-col gap-6 sm:flex-row sm:items-end">
          <nav className="flex max-w-xl flex-wrap gap-x-5 gap-y-2 text-sm" aria-label="Bunnmeny">
            {[...primaryNavigation, ...utilityNavigation].map((item) => (
              <Link key={item.href} to={item.href} className="text-muted-foreground transition hover:text-foreground">
                {item.label}
              </Link>
            ))}
            <Link to="/personvern" className="text-muted-foreground transition hover:text-foreground">
              Personvern
            </Link>
          </nav>

          <div className="flex gap-2">
            {socialLinks.map(({ label, href, icon: Icon }) => (
              <a
                key={href}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="group relative flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition hover:-translate-y-0.5 hover:text-foreground"
              >
                <Icon className="size-5" aria-hidden="true" />
                <ArrowUpRight className="absolute right-1 top-1 size-3 opacity-0 transition group-hover:opacity-100" aria-hidden="true" />
              </a>
            ))}
            <Link
              to="/kontakt"
              aria-label="Kontakt oss"
              className="flex size-10 items-center justify-center rounded-lg border bg-background text-muted-foreground transition hover:-translate-y-0.5 hover:text-foreground"
            >
              <Mail className="size-5" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
