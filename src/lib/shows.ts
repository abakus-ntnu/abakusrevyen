// Forestillinger.
export type Show = {
  name: string;
  when: Date;
  where: { name: string; mapLink: string };
  tickets: { live?: string; stream?: string };
};
export const SHOWS: Show[] = [
  {
    name: "Premiere",
    when: new Date("2026-02-12T19:00:00+0100"),
    where: {
      name: "Verkstedshallen",
      mapLink: "https://maps.app.goo.gl/b8GwxaeLmXmZwPm66",
    },
    tickets: {
      live: undefined,
      stream: undefined,
    },
  },
  {
    name: "Andre forestilling",
    when: new Date("2026-02-13T17:00:00+0100"),
    where: {
      name: "Verkstedshallen",
      mapLink: "https://maps.app.goo.gl/b8GwxaeLmXmZwPm66",
    },
    tickets: {
      live: undefined,
      stream: undefined,
    },
  },
  {
    name: "Siste forestilling",
    when: new Date("2026-02-13T20:00:00+0100"),
    where: {
      name: "Verkstedshallen",
      mapLink: "https://maps.app.goo.gl/b8GwxaeLmXmZwPm66",
    },
    tickets: {
      live: undefined,
      stream: undefined,
    },
  },
];

// SLIPP
export const SHOW_REVEAL = new Date("2026-01-09T15:18:00+0100");
export const TICKET_RELEASE: Date | "TBA" = "TBA";
export const TICKET_LINK: string | undefined = undefined;
