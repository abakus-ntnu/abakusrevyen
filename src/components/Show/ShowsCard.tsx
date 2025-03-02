import { useEffect, useState, type ReactNode } from "react";
import { SHOWS } from "@/lib/shows";
import { MapPin, Ticket, Clock, TvMinimalPlay } from "lucide-react";

interface Props {}

function TabButton({
  onClick,
  active,
  children,
}: Readonly<{ onClick: () => void; active: boolean; children: ReactNode }>) {
  return (
    <button
      className={`rounded-t-lg px-6 py-3 transition-colors ${active && "bg-primary"}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

function InfoField({
  icon,
  name,
  children,
}: Readonly<{ icon: ReactNode; name: string; children: ReactNode }>) {
  return (
    <div className="flex grow flex-col gap-2 p-2">
      <span>{name}</span>
      <div className="flex gap-1 rounded-md">
        {icon}
        {children}
      </div>
    </div>
  );
}

function Button({
  href,
  children,
}: Readonly<{ href: string; children: ReactNode }>) {
  return (
    <a
      target="_blank"
      href={href}
      className="flex gap-1.5 rounded-md bg-white p-2 text-black shadow-sm shadow-red-800 transition-all hover:bg-gray-300 hover:shadow-md"
    >
      {children}
    </a>
  );
}

export default function ShowsCard({}: Readonly<Props>) {
  const [tab, setTab] = useState(0);
  const [show, setShow] = useState(SHOWS[tab]);
  const [ticketTab, setTicketTab] = useState(false);

  useEffect(() => {
    setShow(SHOWS[tab]);
  }, [tab]);

  return (
    <div className="w-full max-w-screen-sm rounded-lg bg-primary text-white">
      <div className="flex rounded-t-lg bg-secondary">
        {SHOWS.map((show, i) => (
          <TabButton onClick={() => setTab(i)} active={tab === i}>
            {show.name}
          </TabButton>
        ))}
      </div>
      <div className="grid w-full grid-cols-1 gap-3 px-6 py-3 md:grid-cols-2 md:items-center">
        <InfoField name="Når" icon={<Clock />}>
          {show.when.toLocaleString("no-NB", {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Oslo",
          })}
        </InfoField>
        <InfoField name="Hvor" icon={<MapPin />}>
          {show.where}
        </InfoField>
      </div>
      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
        <Button href={show.tickets.live}>
          <Ticket />
          Kjøp billetter
        </Button>
        <Button href={show.tickets.stream}>
          <TvMinimalPlay />
          Kjøp live-stream billetter
        </Button>
      </div>
    </div>
  );
}
