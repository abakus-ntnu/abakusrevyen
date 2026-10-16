import { getMediaUrl } from '@/features/media/media-url'

const revueLogo = (filename: string) => getMediaUrl(`images/revy_logoer/${filename}`)

export type Revue = {
  year: number
  title: string
  logo: string
  videos: Array<{ label: string; url: string }>
}

export const revues: Revue[] = [
  { year: 2026, title: 'Skal, skal ikke', logo: revueLogo('skal_skal_ikke.webp'), videos: [{ label: 'Se forestillingen', url: 'https://www.youtube.com/watch?v=bV8POVzQ7Fo&list=PLeAA7WakWMJqRvvVc10B9Pr5o_UG18xuX' }] },
  { year: 2025, title: 'Objektivt sett', logo: revueLogo('objektivt_sett_dark_logo.webp'), videos: [{ label: 'Se forestillingen', url: 'https://www.youtube.com/watch?v=w6pnAzlhoaM' }] },
  { year: 2024, title: 'Best før', logo: revueLogo('best_foer_logo.webp'), videos: [{ label: 'Se forestillingen', url: 'https://www.youtube.com/watch?v=gYgAegpTmyI' }] },
  { year: 2023, title: 'Grevens tid – 23:59', logo: revueLogo('grevens_tid_logo.webp'), videos: [{ label: 'Se forestillingen', url: 'https://www.youtube.com/watch?v=GzcgzNqLaRc' }] },
  { year: 2022, title: 'Svin på skogen', logo: revueLogo('Svin_paa_skogen_logo.webp'), videos: [{ label: 'Se forestillingen', url: 'https://www.youtube.com/watch?v=EiuAtR7zPI4' }] },
  { year: 2021, title: 'Marionett', logo: revueLogo('marionett.webp'), videos: [{ label: 'Se forestillingen', url: 'https://www.youtube.com/watch?v=TvA-oNItlwA' }] },
  { year: 2020, title: 'Satte spor', logo: revueLogo('satte_spor.webp'), videos: [{ label: 'Se forestillingen', url: 'https://www.youtube.com/watch?v=dB0fC4VJsGI' }] },
  { year: 2019, title: 'Kult!', logo: revueLogo('kult.webp'), videos: [{ label: 'Se forestillingen', url: 'https://www.youtube.com/watch?v=3XtropmKsrg' }] },
  { year: 2018, title: 'Solidarisk', logo: revueLogo('solidarisk_web.webp'), videos: [{ label: 'Se akt 1', url: 'https://www.youtube.com/watch?v=yfLDWofs0-8' }, { label: 'Se akt 2', url: 'https://www.youtube.com/watch?v=8b91ozp3i6Y' }] },
  { year: 2017, title: 'Push Pop Baluba!', logo: revueLogo('pushpop_small.webp'), videos: [{ label: 'Se akt 1', url: 'https://www.youtube.com/watch?v=8lyOg-lV1pg' }, { label: 'Se akt 2', url: 'https://www.youtube.com/watch?v=gYTWXmaQfZk' }] },
]
