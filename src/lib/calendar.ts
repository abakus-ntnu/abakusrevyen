import { v4 } from "uuid";
import { SHOWS } from "./shows";

export function getCalenderURL() {
  const formatDate = (date: Date) => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  };

  let ics = `BEGIN:VCALENDAR
VERSION:2.0`;

  for (let show of SHOWS) {
    let endtime = new Date(show.when);
    endtime.setHours(show.when.getHours() + 2);

    ics += `
BEGIN:VEVENT
SUMMARY:Abakusrevyen ${show.name}
DTSTART:${formatDate(show.when)}
DTEND:${formatDate(endtime)}
DTSTAMP:${formatDate(new Date())}
UID:${v4()}-${show.name.replaceAll(" ", "")}
DESCRIPTION:${show.name}. Link til lokasjon: ${show.where.mapLink}
LOCATION:${show.where.name}
ORGANIZER:Abakusrevyen
STATUS:CONFIRMED
PRIORITY:1
END:VEVENT
`;
  }

  ics += "END:VCALENDAR";

  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
}
