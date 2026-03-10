import { Facebook, Instagram, Mail, Youtube } from "lucide-astro";
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
import SkalSkalIkkeLogo from "../images/revy_logoer/skal_skal_ikke.webp";
import SkalSkalIkkeGroupImage from "../images/gruppebilder/skal_skal_ikke.webp";
import { SHOWS, SHOW_REVEAL } from "./shows";
import { Scroll } from "lucide-react";

// Perioder
export const RECRUITMENT_START = new Date("2025-08-25T07:00:00+0100"); // Start av opptak
export const RECRUITMENT_END = new Date("2025-09-01T11:00:00+0100"); // Opptak slutt
export const COUNTDOWN_START = SHOW_REVEAL;

export const TICKET_RELEASE = new Date("2026-02-19T16:00:00+0100");
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
    name: "YouTube",
    href: "https://www.youtube.com/@abakusrevyen",
    external: true,
    Icon: Youtube,
  },
  {
    name: "Email",
    href: "/kontakt",
    external: false,
    Icon: Mail,
  },
];

export const YOUTUBE_CHANNEL_URL = "https://www.youtube.com/@abakusrevyen";
export const YOUTUBE_WATCH_BASE_URL = "https://www.youtube.com/watch?v=";
export const YOUTUBE_EMBED_BASE_URL = "https://www.youtube.com/embed/";
export const YOUTUBE_PLAYLIST_BASE_URL =
  "https://www.youtube.com/playlist?list=";

export type RevueLink = {
  name: string;
  videoId?: string;
  playlistId?: string;
  href?: string;
  embed?: string;
  embedQuery?: string;
  liveFrom?: string;
};

type Revue = {
  year: string;
  name: string;
  logo: ImageMetadata;
  groupImage?: ImageMetadata;
  color: string;
  dark: boolean;
  /**
   * Shared YouTube playlist for this revue.
   * All revue video links inherit this unless they override `playlistId` per-link.
   */
  playlistId?: string;
  links?: RevueLink[];
  mainLink?: RevueLink;
  otherLinks?: RevueLink[];
  playlistLink?: RevueLink;
};

const withRevueDefaults = (revue: Revue, link: RevueLink): RevueLink => ({
  ...link,
  playlistId: link.playlistId ?? revue.playlistId,
});

export const getRevueMainLink = (revue: Revue): RevueLink | undefined => {
  const link = revue.mainLink ?? revue.links?.[0];
  return link ? withRevueDefaults(revue, link) : undefined;
};

export const getRevueOtherLinks = (revue: Revue): RevueLink[] =>
  (revue.otherLinks ?? revue.links?.slice(1) ?? []).map((link) =>
    withRevueDefaults(revue, link),
  );

export const getRevuePlaylistLink = (revue: Revue): RevueLink | undefined =>
  revue.playlistLink ? withRevueDefaults(revue, revue.playlistLink) : undefined;

export const getRevueDisplayLinks = (revue: Revue): RevueLink[] => {
  const mainLink = getRevueMainLink(revue);
  const otherLinks = getRevueOtherLinks(revue);

  return mainLink ? [mainLink, ...otherLinks] : otherLinks;
};

export const isRevueLinkLive = (
  link: RevueLink,
  now: Date = new Date(),
): boolean => !link.liveFrom || new Date(link.liveFrom) <= now;

export const getRevueLinkHref = (link: RevueLink): string | undefined =>
  link.videoId
    ? `${YOUTUBE_WATCH_BASE_URL}${link.videoId}${link.playlistId ? `&list=${link.playlistId}` : ""}`
    : link.playlistId
      ? `${YOUTUBE_PLAYLIST_BASE_URL}${link.playlistId}`
      : link.href;

export const getRevueLinkEmbed = (link: RevueLink): string | undefined =>
  link.videoId
    ? `${YOUTUBE_EMBED_BASE_URL}${link.videoId}${link.embedQuery ? `?${link.embedQuery}` : ""}`
    : link.embed;

export const getRevueMainLinkAt = (
  revue: Revue,
  now: Date = new Date(),
): RevueLink | undefined => {
  const mainLink = getRevueMainLink(revue);
  return mainLink && isRevueLinkLive(mainLink, now) ? mainLink : undefined;
};

export const getRevueOtherLinksAt = (
  revue: Revue,
  now: Date = new Date(),
): RevueLink[] =>
  getRevueOtherLinks(revue).filter((link) => isRevueLinkLive(link, now));

export const PREVIOUS_REVUES: Revue[] = [
  {
    year: "2017",
    name: "Push Pop Baluba!",
    logo: PushPopBalubaLogo,
    color: "!bg-[#2d222a]",
    dark: true,
    links: [
      {
        name: "Se akt 1",
        videoId: "8lyOg-lV1pg",
      },
      {
        name: "Se akt 2",
        videoId: "gYTWXmaQfZk",
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
        videoId: "yfLDWofs0-8",
      },
      {
        name: "Se akt 2",
        videoId: "8b91ozp3i6Y",
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
        videoId: "3XtropmKsrg",
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
        videoId: "dB0fC4VJsGI",
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
        videoId: "TvA-oNItlwA",
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
        videoId: "EiuAtR7zPI4",
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
        videoId: "GzcgzNqLaRc",
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
        name: "Se forestillingen",
        videoId: "gYgAegpTmyI",
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
        videoId: "w6pnAzlhoaM",
      },
    ],
  },
  {
    year: "2026",
    name: "Skal, Skal ikke",
    logo: SkalSkalIkkeLogo,
    groupImage: SkalSkalIkkeGroupImage,
    color: "!bg-[#c1e6f9]",
    dark: false,
    playlistId: "PLeAA7WakWMJqRvvVc10B9Pr5o_UG18xuX",
    mainLink: {
      name: "Se forestillingen",
      videoId: "bV8POVzQ7Fo",
      liveFrom: "2026-03-26T12:00:00+01:00",
    },
    otherLinks: [
      {
        name: "Ingen dekning (Fakk Eduroam)",
        videoId: "PNmWT9wsP9o",
      },
      {
        name: "Aldri Mer Hiroshima",
        videoId: "pi4A-Ye4Nmw",
      },
      {
        name: "AI avsmak (Gjør det selv)",
        videoId: "k3AYDZ8hUyc",
      },
      {
        name: "Bare vent, snart blir jeg konsulent",
        videoId: "Si5DGtFvxug",
      },
      {
        name: "Bli med oss - Lillefinale",
        videoId: "mhhSza5s5Jw",
      },
      {
        name: "Bakerst i kjøpeskapet",
        videoId: "SNLy2ldVa-s",
        liveFrom: "2026-03-11T12:00:00+01:00",
      },
      {
        name: "Jeg hater kollektiv (Kollektivet mitt)",
        videoId: "tdYf_nvJa5A",
        liveFrom: "2026-03-12T12:00:00+01:00",
      },
      {
        name: "Hjem fra byen",
        videoId: "nJUQmFQns7E",
        liveFrom: "2026-03-17T12:00:00+01:00",
      },
      {
        name: "Brødrene Dahls",
        videoId: "SlGwxOWeixY",
        liveFrom: "2026-03-19T12:00:00+01:00",
      },
      {
        name: "Utvekslingskontoret",
        videoId: "BIqDJqTd1v8",
        liveFrom: "2026-03-24T12:00:00+01:00",
      },
    ],
    playlistLink: {
      name: "Se numrene",
    },
  },
];
