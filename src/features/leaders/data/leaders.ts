import { getMediaUrl } from '@/features/media/media-url'

const leaderImage = (filename: string) => getMediaUrl(`images/ledere/${filename}`)

export type Leader = {
  slug: string
  name: string
  role: string
  group?: string
  email: string
  image: string
  board?: boolean
}

export const leaders: Leader[] = [
  { slug: 'linnea-johannesen', name: 'Linnéa Josefine Johannesen', role: 'Revysjef', email: 'linnea.johannesen@abakus.no', image: leaderImage('linnea-johannesen.webp'), board: true },
  { slug: 'rikke-schjonsby', name: 'Rikke Schjønsby', role: 'Nestleder', email: 'rikke.schjoensby@abakus.no', image: leaderImage('rikke-schjonsby.webp'), board: true },
  { slug: 'carl-christian-steen', name: 'Carl Christian Steen', role: 'Økonomiansvarlig', email: 'carl.steen@abakus.no', image: leaderImage('carl-christian-steen.webp'), board: true },
  { slug: 'brage-naustan', name: 'Brage Tiller Naustan', role: 'Regissør', group: 'Skuespill', email: 'brage.naustan@abakus.no', image: leaderImage('brage-naustan.webp') },
  { slug: 'camilla-klem', name: 'Camilla Klem', role: 'Assisterende regissør', group: 'Skuespill', email: 'camilla.klem@abakus.no', image: leaderImage('camilla-klem.webp') },
  { slug: 'phillip-bjornevoll', name: 'Phillip Nilsen Bjørnevoll', role: 'Musikalsk regissør', group: 'Band og arring', email: 'phillip.bjoernevoll@abakus.no', image: leaderImage('phillip-bjornevoll.webp') },
  { slug: 'eirik-roed', name: 'Eirik Røed', role: 'Bandsjef', group: 'Band og arring', email: 'eirik.roeed@abakus.no', image: leaderImage('eirik-roed.webp') },
  { slug: 'andreas-svendsrud', name: 'Andreas Kluge Svendsrud', role: 'Manusansvarlig', group: 'Manus', email: 'andreas.svendsrud@abakus.no', image: leaderImage('andreas-svendsrud.webp') },
  { slug: 'ellen-urdal', name: 'Ellen Urdal', role: 'Dansesjef', group: 'Dans', email: 'ellen.urdal@abakus.no', image: leaderImage('ellen-urdal.webp') },
  { slug: 'viktor-grevskott', name: 'Viktor Grevskott', role: 'Scenesjef', group: 'Scene', email: 'viktor.grevskott@abakus.no', image: leaderImage('viktor-grevskott.webp') },
  { slug: 'william-saether', name: 'William Sæther', role: 'Teknikksjef', group: 'Teknikk', email: 'william.saether@abakus.no', image: leaderImage('william-saether.webp') },
  { slug: 'madelen-lothe', name: 'Madelen Hellervik Lothe', role: 'Kostymeansvarlig', group: 'Kostyme', email: 'madelen.lothe@abakus.no', image: leaderImage('madelen-lothe.webp') },
  { slug: 'sebastian-aarsheim', name: 'Sebastian Aarsheim', role: 'PR-sjef', group: 'PR', email: 'sebastian.aarsheim@abakus.no', image: leaderImage('sebastian-aarsheim.webp') },
  { slug: 'sander-skofsrud', name: 'Sander Rom Skofsrud', role: 'Sosialsjef', group: 'Sosial', email: 'sander.skofsrud@abakus.no', image: leaderImage('sander-skofsrud.webp') },
]

export function getLeader(slug: string | undefined) {
  return leaders.find((leader) => leader.slug === slug)
}
