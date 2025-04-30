import { Facebook, Instagram, Mail } from "lucide-astro";
import PushPopBalubaLogo from "../images/revy_logoer/pushpop_small.webp";
import SolidariskLogo from "../images/revy_logoer/solidarisk_web.webp";
import SolidariskGroupImage from "../images/gruppebilder/solidarisk.webp";
import KultLogo from "../images/revy_logoer/kult.webp";
import KultImage from "../images/gruppebilder/kult.webp";
import SatteSporLogo from "../images/revy_logoer/satte_spor.webp";
import MarionettLogo from "../images/revy_logoer/marionett.webp";
import SvinPaaSkogenLogo from "../images/revy_logoer/Svin_paa_skogen_logo_hvit_skrift.webp";
import SvinPaaSkogenGroupImage from "../images/gruppebilder/svin_paa_skogen.webp";
import GrevensTidLogo from "../images/revy_logoer/grevens_tid_logo.webp";
import GrevensTidGroupImage from "../images/gruppebilder/grevens_tid.webp";
import BestFoerLogo from "../images/revy_logoer/best_foer_sentrert.webp";
import BestFoerGroupImage from "../images/gruppebilder/best_foer.webp";
import ObjektivtSettLogo from "../images/revy_logoer/objektivt_sett_light_logo.webp";
import ObjektivtSettGroupImage from "../images/gruppebilder/objektivt_sett.webp";
import { SHOWS, SHOW_REVEAL } from "./shows";
import { Scroll } from "lucide-react";

// Perioder
export const RECRUITMENT_START = new Date("2024-7-15T00:00:00+0100"); // Start av opptak
export const RECRUITMENT_END = new Date("2024-8-15T00:00:00+0100"); // Opptak slutt
export const COUNTDOWN_START = SHOW_REVEAL;

export const TICKET_RELEASE = new Date("2025-02-19T16:00:00+0100");
export const SHOW_START = new Date(SHOWS[0].when); // Premiære
export const SHOW_END = new Date(SHOWS.toReversed()[0].when); // Siste forestilling

export type Period =
  | "recruitment"
  | "ticketsCountdown"
  | "showCountdown"
  | "showCurrent"
  | "break";

export const PERIODS: { from: Date; period: Period }[] = [
  { from: RECRUITMENT_START, period: "recruitment" },
  { from: RECRUITMENT_END, period: "break" },
  { from: COUNTDOWN_START, period: "ticketsCountdown" },
  { from: TICKET_RELEASE, period: "showCountdown" },
  { from: SHOW_START, period: "showCurrent" },
  { from: SHOW_END, period: "break" },
];

export const SOCIALS = [
  {
    name: "Facebook",
    href: "https://facebook.com/Abakusrevyen",
    external: true,
    Icon: Facebook,
  },
  {
    name: "Instagram",
    href: "https://instagram.com/abakusrevyen",
    external: true,
    Icon: Instagram,
  },
  {
    name: "Email",
    href: "/kontakt",
    external: false,
    Icon: Mail,
  },
];

export type Revuy = {
  year: string;
  name: string;
  logo: ImageMetadata;
  groupImage?: ImageMetadata;
  color: string;
  dark: boolean;
  links: { name: string; href: string; embed?: string }[];
};

export const PREVIOUS_REVUES: Revuy[] = [
  {
    year: "2017",
    name: "Push Pop Baluba!",
    logo: PushPopBalubaLogo,
    color: "!bg-[#2d222a]",
    dark: true,
    links: [
      {
        name: "Se akt 1",
        href: "https://www.youtube.com/watch?v=8lyOg-lV1pg",
        embed: "https://www.youtube.com/embed/8lyOg-lV1pg",
      },
      {
        name: "Se akt 2",
        href: "https://www.youtube.com/watch?v=gYTWXmaQfZk",
        embed: "https://www.youtube.com/embed/gYTWXmaQfZk",
      },
    ],
  },
  {
    year: "2018",
    name: "Solidarisk",
    logo: SolidariskLogo,
    groupImage: SolidariskGroupImage,
    color: "!bg-[#000000]",
    dark: true,
    links: [
      {
        name: "Se akt 1",
        href: "https://www.youtube.com/watch?v=yfLDWofs0-8",
        embed: "https://www.youtube.com/embed/yfLDWofs0-8",
      },
      {
        name: "Se akt 2",
        href: "https://www.youtube.com/watch?v=8b91ozp3i6Y",
        embed: "https://www.youtube.com/embed/8b91ozp3i6Y",
      },
    ],
  },
  {
    year: "2019",
    name: "Kult!",
    logo: KultLogo,
    groupImage: KultImage,
    color: "!bg-[#e8dbb7]",
    dark: false,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=3XtropmKsrg",
        embed: "https://www.youtube.com/embed/3XtropmKsrg",
      },
    ],
  },
  {
    year: "2020",
    name: "Satte Spor",
    logo: SatteSporLogo,
    color: "!bg-[#ef8b72]",
    dark: false,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=dB0fC4VJsGI",
        embed: "https://www.youtube.com/embed/dB0fC4VJsGI",
      },
    ],
  },
  {
    year: "2021",
    name: "Marionett",
    logo: MarionettLogo,
    color: "!bg-[#1d3060]",
    dark: true,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=TvA-oNItlwA",
        embed: "https://www.youtube.com/embed/TvA-oNItlwA",
      },
    ],
  },
  {
    year: "2022",
    name: "Svin På Skogen",
    logo: SvinPaaSkogenLogo,
    groupImage: SvinPaaSkogenGroupImage,
    color: "!bg-[#790420]",
    dark: true,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=EiuAtR7zPI4",
        embed: "https://www.youtube.com/embed/EiuAtR7zPI4",
      },
    ],
  },
  {
    year: "2023",
    name: "Grevens Tid – 23:59",
    logo: GrevensTidLogo,
    groupImage: GrevensTidGroupImage,
    color: "!bg-[#410507]",
    dark: true,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=GzcgzNqLaRc",
        embed: "https://www.youtube.com/embed/GzcgzNqLaRc",
      },
    ],
  },
  {
    year: "2024",
    name: "Best før",
    logo: BestFoerLogo,
    groupImage: BestFoerGroupImage,
    color: "!bg-[#f7cee5]",
    dark: false,
    links: [
      {
        name: "Se opptak av stream",
        href: "https://vier.live/act/abakusrevyen-2024---best-f-r-2024",
      },
    ],
  },
  {
    year: "2025",
    name: "Objektivt Sett",
    logo: ObjektivtSettLogo,
    groupImage: ObjektivtSettGroupImage,
    color: "!bg-[#ffeeb3]",
    dark: false,
    links: [
      {
        name: "Se forestillingen",
        href: "https://www.youtube.com/watch?v=w6pnAzlhoaM",
      },
    ],
  },
];
