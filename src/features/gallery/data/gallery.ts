import { getMediaUrl } from '@/features/media/media-url'

const skalSkalIkke = [
  'IMG_1014.webp', 'IMG_1028.webp', 'IMG_1038.webp', 'IMG_1056.webp', 'IMG_1077.webp', 'IMG_1094.webp',
  'IMG_1102.webp', 'IMG_1119.webp', 'IMG_1127.webp', 'IMG_1142.webp', 'IMG_1150.webp', 'IMG_1164.webp',
  'IMG_1187.webp', 'IMG_1228.webp', 'IMG_1278.webp', 'IMG_1283.webp', 'IMG_1301.webp', 'IMG_1308.webp',
]

const objektivtSett = [
  'IMG_0033.webp', 'IMG_0036.webp', 'IMG_0057.webp', 'IMG_0202.webp', 'IMG_0221.webp', 'IMG_0248.webp',
  'IMG_0256.webp', 'IMG_0266.webp', 'IMG_0299.webp', 'IMG_0309.webp', 'IMG_0329.webp', 'IMG_0340.webp',
  'IMG_0445.webp', 'IMG_0463.webp', 'IMG_0467.webp', 'IMG_0533.webp', 'IMG_0544.webp', 'IMG_0550.webp',
  'IMG_0572.webp', 'IMG_0574.webp', 'IMG_0617.webp', 'IMG_0631.webp', 'IMG_0634.webp', 'IMG_0653.webp',
  'IMG_0683.webp', 'IMG_0694.webp', 'IMG_0709.webp',
]

const earlier = [
  'DSC01843.webp', 'DSC01856.webp', 'DSC01873.webp', 'DSCF7591.webp', 'DSCF7610.webp', 'DSCF7721.webp',
  'DSCF7730.webp', 'DSCF7751.webp', 'DSCF7794.webp', 'DSCF7805.webp', 'DSCF7821.webp', 'DSC_0021.webp',
  'DSC_1999.webp', 'DSC_2156.webp', 'DSC_2193.webp', 'P3050036.webp', 'P3170242.webp',
]

function galleryImages(folder: string, filenames: string[]) {
  return filenames.map((filename) => getMediaUrl(`images/gallery/${folder ? `${folder}/` : ''}${filename}`))
}

export const gallerySections = [
  { name: 'Skal, skal ikke', images: galleryImages('skal_skal_ikke', skalSkalIkke) },
  { name: 'Objektivt sett', images: galleryImages('objektivt_sett', objektivtSett) },
  { name: 'Tidligere', images: galleryImages('', earlier) },
]
