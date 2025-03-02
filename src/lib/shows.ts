// Forestillinger.
export type Show = {
  name: string;
  when: Date;
  where: { name: string; mapLink: string };
};
export const SHOWS = [
  {
    name: "Premiere",
    when: new Date("2025-03-13T19:00:00+0100"),
    where: "Byscenen i Trondheim",
    tickets: {
      live: "https://www.byscenen.no/event/abakusrevyen-2025-objektivt-sett-1",
      stream: "#",
    },
  },
  {
    name: "Andre forestilling",
    when: new Date("2025-03-14T17:00:00+0100"),
    where: "Byscenen i Trondheim",
    tickets: {
      live: "https://www.byscenen.no/event/abakusrevyen-2025-objektivt-sett-2",
      stream: "#",
    },
  },
  {
    name: "Siste forestilling",
    when: new Date("2025-03-14T20:30:00+0100"),
    where: "Byscenen i Trondheim",
    tickets: {
      live: "https://www.byscenen.no/event/abakusrevyen-2025-objektivt-sett-3",
      stream: "#",
    },
  },
];

// SLIPP
export const SHOW_REVEAL = new Date("2025-02-07T22:00:00+0100");
export const TICKET_RELEASE: Date | "TBA" = new Date(
  "2025-02-19T16:00:00+0100",
);
export const TICKET_LINK: string | undefined = "https://byscn.no/abakus_25";
