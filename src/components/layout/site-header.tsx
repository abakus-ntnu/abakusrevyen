import { useEffect, useState } from 'react'
import { Menu, X } from 'lucide-react'
import { Link, NavLink } from 'react-router'
import { primaryNavigation, utilityNavigation } from '@/app/navigation'
import { ThemeToggle } from '@/components/layout/theme-toggle'
import { getMediaUrl } from '@/features/media/media-url'
import { cn } from '@/lib/utils'

const desktopNavigation = primaryNavigation.filter(({ href }) =>
  ['/om-oss', '/galleri', '/revyer'].includes(href),
)

function DesktopLink({ href, label }: { href: string; label: string }) {
  return (
    <NavLink
      to={href}
      className={({ isActive }) =>
        cn(
          'rounded-md px-3 py-2 text-base text-muted-foreground transition hover:bg-muted hover:text-foreground',
          isActive && 'bg-muted text-foreground',
        )
      }
    >
      {label}
    </NavLink>
  )
}

export function SiteHeader() {
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  const mobileNavigation = [...utilityNavigation, ...primaryNavigation]

  return (
    <header className="relative z-50 bg-background">
      <div className="mx-auto flex h-[4.5rem] max-w-6xl items-center justify-between gap-5 px-4 sm:px-6 md:h-28 lg:px-8">
        <Link to="/" className="flex items-center gap-3" aria-label="Abakusrevyen – forsiden" onClick={() => setIsOpen(false)}>
          <img src={getMediaUrl('images/revy-logo.webp')} alt="" className="size-10 md:size-12" />
          <span className="font-heading text-lg font-semibold tracking-tight md:text-xl">Abakusrevyen</span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Hovedmeny">
          {desktopNavigation.map((item) => (
            <DesktopLink key={item.href} href={item.href} label={item.label} />
          ))}
        </nav>

        <div className="ml-auto hidden items-center gap-2 lg:flex">
          {utilityNavigation.map((item) => (
            <DesktopLink key={item.href} href={item.href} label={item.label} />
          ))}
        </div>

        <ThemeToggle />

        <button
          type="button"
          className="inline-flex size-10 items-center justify-center rounded-lg border bg-background transition hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
          aria-label={isOpen ? 'Lukk menyen' : 'Åpne menyen'}
          aria-expanded={isOpen}
          aria-controls="mobile-navigation"
          onClick={() => setIsOpen((open) => !open)}
        >
          {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
        </button>
      </div>

      {isOpen ? (
        <nav
          id="mobile-navigation"
          className="fixed inset-x-0 bottom-0 top-[4.5rem] overflow-y-auto border-t bg-background px-4 py-5 md:top-28 lg:hidden"
          aria-label="Mobilmeny"
        >
          <div className="mx-auto grid max-w-2xl gap-2">
            {mobileNavigation.map(({ href, label, icon: Icon }) => (
              <NavLink
                key={href}
                to={href}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl border bg-card p-4 text-base font-medium transition hover:bg-muted',
                    isActive && 'border-primary/40 bg-primary/5 text-primary',
                  )
                }
              >
                <span className="flex size-10 items-center justify-center rounded-lg bg-muted text-primary">
                  <Icon className="size-5" aria-hidden="true" />
                </span>
                {label}
              </NavLink>
            ))}
          </div>
        </nav>
      ) : null}
    </header>
  )
}
