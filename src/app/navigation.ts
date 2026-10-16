import type { LucideIcon } from 'lucide-react'
import { CircleUserRound, ContactRound, Drama, Images, Info, Radio, Users } from 'lucide-react'

export type NavigationItem = {
  label: string
  href: string
  icon: LucideIcon
}

export const primaryNavigation: NavigationItem[] = [
  { label: 'Om oss', href: '/om-oss', icon: Info },
  { label: 'Grupper', href: '/grupper', icon: Users },
  { label: 'Ledere', href: '/ledere', icon: ContactRound },
  { label: 'Bildegalleri', href: '/galleri', icon: Images },
  { label: 'Tidligere revyer', href: '/revyer', icon: Drama },
]

export const utilityNavigation: NavigationItem[] = [
  { label: 'Livestream', href: '/livestream', icon: Radio },
  { label: 'Kontakt', href: '/kontakt', icon: CircleUserRound },
]
