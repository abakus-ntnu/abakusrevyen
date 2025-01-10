const SHOWS = [
  {
    name: "Abakusrevyen premiere",
    when: new Date(14, 2, 2025, 20, 0, 0),
    where: "Byscenen i Trondheim",
  },
];

export function getCalenderURL() {
  const formatDate = (date: Date) => {
    return date
      .toISOString()
      .replace(/[-:]/g, "")
      .replace(/\.\d{3}/, "");
  };

  let ics = "";

  for (let show of SHOWS) {
    ics += `BEGIN:VCALENDAR
VERSION:2.0
BEGIN:VEVENT
SUMMARY:${show.name}
DTSTART:${formatDate(show.when)}
DTEND:${formatDate(show.when)}
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
