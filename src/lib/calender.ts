import { SHOWS } from "./constants";

export function getCalenderURL() {
  const formatDate = (date: Date) => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  };

  let ics = "";

  for (let show of SHOWS) {
    let endtime = new Date(show.when);
    endtime.setHours(show.when.getHours() + 2);

    ics += `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${show.name}
DTSTART:${formatDate(show.when)}
DTEND:${formatDate(endtime)}
DTSTAMP:${formatDate(new Date())}
UID:1736513384666-AbakusrevyenPremiere
DESCRIPTION:
LOCATION:${show.where}
ORGANIZER:Abakus
STATUS:CONFIRMED
PRIORITY:1
END:VEVENT
END:VCALENDAR
`;
  }

  return `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`;
}
