import { Facebook, Instagram, Mail } from "lucide-astro";
import PushPopBalubaImage from "../images/revy_logoer/pushpop_small.png";
import SolidariskImage from "../images/revy_logoer/solidarisk_web.png";
import KultImage from "../images/revy_logoer/kult.png";
import SatteSporImage from "../images/revy_logoer/satte_spor.png";
import MarionettImage from "../images/revy_logoer/marionett.png";
import SvinPaaSkogenImage from "../images/revy_logoer/Svin_paa_skogen_logo_hvit_skrift.png";
import GrevensTidImage from "../images/revy_logoer/grevens_tid_logo.png";
import BestFoerImage from "../images/revy_logoer/best_foer_sentrert.png";
import BandLogo from "../images/undergrupper_logoer/band-logo.jpg";
import DansLogo from "../images/undergrupper_logoer/dans-logo.jpg";
import KorLogo from "../images/undergrupper_logoer/kor-logo.jpg";
import KostymeLogo from "../images/undergrupper_logoer/kostyme-logo.jpg";
import PRLogo from "../images/undergrupper_logoer/pr-logo.jpg";
import RegiLogo from "../images/undergrupper_logoer/regi-logo.jpg";
import RevystyretLogo from "../images/undergrupper_logoer/revystyret-logo.jpg";
import SceneLogo from "../images/undergrupper_logoer/scene-logo.jpg";
import SkuespillLogo from "../images/undergrupper_logoer/skuespill-logo.jpg";
import SocialLogo from "../images/undergrupper_logoer/social-logo.jpg";
import TeknikkLogo from "../images/undergrupper_logoer/teknikk-logo.jpg";

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

export const SUBGROUPS = [
  {
    name: "Revybandet",
    brief: "Bandet til revyen.",
    image: BandLogo,
  },
  {
    name: "Koret",
    brief: "Koret til revyen.",
    image: KorLogo,
  },
  {
    name: "Sosialgjengen",
    brief: "Vi sørger for at alle har det gøy!",
    image: SocialLogo,
  },
  {
    name: "Scene",
    brief: "Vi lager og driver scenen!",
    image: SceneLogo,
  },
  {
    name: "Teknikk",
    brief: "Vi ordner alt det tekniske!",
    image: TeknikkLogo,
  },
  {
    name: "Dans",
    brief: "💃💃💃",
    image: DansLogo,
  },
  {
    name: "Regi",
    brief: "Vi skriver og dirigerer revyen!",
    image: RegiLogo,
  },
  {
    name: "Kostyme",
    brief: "Her lages alle kostymene!",
    image: KostymeLogo,
  },
  {
    name: "Skuespill",
    brief: "De fra dramaklubben.",
    image: SkuespillLogo,
  },
  {
    name: "PR",
    brief: "...",
    image: PRLogo,
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
        name: "Opptak kommer",
        href: "",
      },
    ],
  },
];
