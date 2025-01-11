import { Facebook, Instagram, Mail } from "lucide-astro";
import PushPopBalubaImage from "../images/revy_logoer/pushpop_small.png";
import SolidariskImage from "../images/revy_logoer/solidarisk_web.png";
import KultImage from "../images/revy_logoer/kult.png";
import SatteSporImage from "../images/revy_logoer/satte_spor.png";
import MarionettImage from "../images/revy_logoer/marionett.png";
import SvinPaaSkogenImage from "../images/revy_logoer/Svin_paa_skogen_logo_hvit_skrift.png";
import GrevensTidImage from "../images/revy_logoer/grevens_tid_logo.png";
import BestFoerImage from "../images/revy_logoer/best_foer_sentrert.png";
import BestFoerGruppebilde from "../images/gruppebilder/best_foer_gruppebilde2.png";
import Forsidebilde from "../images/gruppebilder/forsidebilde.png";
import GrevensTidGruppebilde from "../images/gruppebilder/grevens_tid_gruppebilde.png";
import SvinPaaSkogenGruppebilde from "../images/gruppebilder/svin_paa_gruppebilde.jpg";

// Forestillinger. Husk å sortere basert på tid med premiæren først
export const SHOWS = [
  {
    name: "Premiere",
    when: new Date(2025, 2, 14, 20, 0, 0),
    where: "Byscenen i Trondheim",
  },
  {
    name: "Andre Forestilling",
    when: new Date(2025, 2, 15, 12, 0, 0),
    where: "Byscenen i Trondheim",
  },
];

// Perioder
export const RECRUITMENT_START = new Date(2024, 7, 15); // Start av opptak
export const RECRUITMENT_END = new Date(2024, 8, 15); // Opptak slutt
export const COUNTDOWN_START = new Date(2025, 1, 15, 12); // SLIPP

export const SHOW_START = new Date(SHOWS[0].when); // Premiære
export const SHOW_END = new Date(SHOWS.toReversed()[0].when); // Siste forestilling

export type Period = "recruitment" | "showStarting" | "showCurrent" | "break";
export const PERIODS: { from: Date; period: Period }[] = [
  { from: RECRUITMENT_START, period: "recruitment" },
  { from: RECRUITMENT_END, period: "break" },
  { from: COUNTDOWN_START, period: "showStarting" },
  { from: SHOW_START, period: "showCurrent" },
  { from: SHOW_END, period: "break" },
];

export const SOCIALS = [
  {
    name: "Facebook",
    profile: "Abakusrevyen",
    href: "https://facebook.com/Abakusrevyen",
    Icon: Facebook,
  },
  {
    name: "Instagram",
    profile: "abakusrevyen",
    href: "https://instagram.com/abakusrevyen",
    Icon: Instagram,
  },
  {
    name: "Mail",
    profile: "revy@abakus.no",
    href: "mailto:revy@abakus.no",
    Icon: Mail,
  },
];

export const PREVIOUS_REVUES = [
  {
    year: "2017",
    name: "Push Pop Baluba!",
    image: PushPopBalubaImage,
    color: "!bg-[#2d222a]",
    dark: true,
    links: [
      {
        name: "Se akt 1",
        href: "https://www.youtube.com/watch?v=8lyOg-lV1pg",
      },
      {
        name: "Se akt 2",
        href: "https://www.youtube.com/watch?v=gYTWXmaQfZk",
      },
    ],
  },
  {
    year: "2018",
    name: "Solidarisk",
    image: SolidariskImage,
    color: "!bg-[#000000]",
    dark: true,
    links: [
      {
        name: "Se akt 1",
        href: "https://www.youtube.com/watch?v=yfLDWofs0-8",
      },
      {
        name: "Se akt 2",
        href: "https://www.youtube.com/watch?v=8b91ozp3i6Y",
      },
    ],
  },
  {
    year: "2019",
    name: "Kult!",
    image: KultImage,
    color: "!bg-[#e8dbb7]",
    dark: false,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=3XtropmKsrg",
      },
    ],
  },
  {
    year: "2020",
    name: "Satte Spor",
    image: SatteSporImage,
    color: "!bg-[#ef8b72]",
    dark: false,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=dB0fC4VJsGI",
      },
    ],
  },
  {
    year: "2021",
    name: "Marionett",
    image: MarionettImage,
    color: "!bg-[#1d3060]",
    dark: true,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=TvA-oNItlwA",
      },
    ],
  },
  {
    year: "2022",
    name: "Svin På Skogen",
    image: SvinPaaSkogenImage,
    color: "!bg-[#790420]",
    dark: true,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=EiuAtR7zPI4",
      },
    ],
  },
  {
    year: "2023",
    name: "Grevens Tid – 23:59",
    image: GrevensTidImage,
    color: "!bg-[#410507]",
    dark: true,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=GzcgzNqLaRc",
      },
    ],
  },
  {
    year: "2024",
    name: "Best før",
    image: BestFoerImage,
    color: "!bg-[#f7cee5]",
    dark: false,
    links: [
      {
        name: "Se opptak av stream",
        href: "https://vier.live/act/abakusrevyen-2024---best-f-r-2024",
      },
    ],
  },
];

export const GALLERY_IMAGES = [
  {
    src: BestFoerGruppebilde,
    alt: "Gruppebilde fra Best før 2024",
  },
  {
    src: Forsidebilde,
    alt: "Forsidebilde fra Grevens Tid 2023",
  },
  {
    src: GrevensTidGruppebilde,
    alt: "Gruppebilde fra Grevens Tid 2023",
  },
  {
    src: SvinPaaSkogenGruppebilde,
    alt: "Gruppebilde fra Svin På Skogen 2022",
  },
];
