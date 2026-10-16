import { getMediaUrl } from '@/features/media/media-url'

const groupLogo = (filename: string) => getMediaUrl(`images/undergrupper_logoer/${filename}`)

export type RevueGroup = {
  slug: string
  name: string
  description: string
  email?: string
  logo?: string
}

export const groups: RevueGroup[] = [
  {
    slug: 'revystyret',
    name: 'Revystyret',
    description: 'Holder oversikt over helheten og sørger for at alle gruppene kan lage revy sammen.',
    email: 'revy-styret@abakus.no',
    logo: groupLogo('revystyret-logo.webp'),
  },
  {
    slug: 'manus',
    name: 'Manus',
    description: 'Skriver sketsjer, sanger og historien som blir til forestillingen.',
    email: 'revy-manus@abakus.no',
    logo: groupLogo('regi-logo.webp'),
  },
  {
    slug: 'skuespill',
    name: 'Skuespill',
    description: 'Gir liv til tekstene på scenen og jobber med roller, uttrykk og timing.',
    email: 'revy-skuespillere@abakus.no',
    logo: groupLogo('skuespill-logo.webp'),
  },
  {
    slug: 'band',
    name: 'Band',
    description: 'Lager og spiller musikken som binder forestillingen sammen.',
    email: 'revy-band@abakus.no',
    logo: groupLogo('band-logo.webp'),
  },
  {
    slug: 'dans',
    name: 'Dans',
    description: 'Lager koreografi og sørger for bevegelse, energi og store øyeblikk på scenen.',
    email: 'revy-dans@abakus.no',
    logo: groupLogo('dans-logo.webp'),
  },
  {
    slug: 'kostyme',
    name: 'Kostyme',
    description: 'Utvikler og lager kostymene som gjør karakterene og revyuniverset synlig.',
    email: 'revy-kostyme@abakus.no',
    logo: groupLogo('kostyme-logo.webp'),
  },
  {
    slug: 'scene',
    name: 'Scene',
    description: 'Bygger kulisser og rekvisitter og får sceneskiftene til å sitte.',
    email: 'revy-scene@abakus.no',
    logo: groupLogo('scene-logo.webp'),
  },
  {
    slug: 'teknikk',
    name: 'Teknikk',
    description: 'Har ansvar for lys, lyd, video og de tekniske løsningene rundt forestillingen.',
    email: 'revy-teknikk@abakus.no',
    logo: groupLogo('teknikk-logo.webp'),
  },
  {
    slug: 'pr',
    name: 'PR',
    description: 'Forteller om revyen gjennom innhold, grafikk, foto og kontakt med publikum.',
    email: 'revy-pr@abakus.no',
    logo: groupLogo('pr-logo.webp'),
  },
  {
    slug: 'sosial',
    name: 'Sosial',
    description: 'Skaper samhold og gode pauser for alle som bruker året på å lage revy.',
    email: 'revy-sosial@abakus.no',
    logo: groupLogo('sosial-logo.webp'),
  },
  {
    slug: 'arring',
    name: 'Arring',
    description: 'Planlegger arrangementene rundt revyen og får de praktiske detaljene på plass.',
    email: 'revy-band@abakus.no',
  },
]

export function getGroup(slug: string | undefined) {
  return groups.find((group) => group.slug === slug)
}
