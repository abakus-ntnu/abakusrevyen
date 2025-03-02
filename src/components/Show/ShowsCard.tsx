import { useEffect, useState, type ReactNode } from "react";
import { SHOWS } from "@/lib/shows";
import { MapPin, Ticket, Clock, ArrowRight } from "lucide-react";

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
      className="block rounded-md bg-secondary p-2 transition-all hover:bg-red-700 hover:shadow-md"
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
    <div className="rounded-lg bg-primary text-white">
      <div className="flex rounded-t-lg bg-secondary">
        {SHOWS.map((show, i) => (
          <TabButton onClick={() => setTab(i)} active={tab === i}>
            {show.name}
          </TabButton>
        ))}
      </div>
      <div className="flex w-screen max-w-screen-sm items-center gap-3 px-6 py-3">
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
        <div className="flex flex-col gap-1">
          <button className="flex gap-1.5 rounded-full bg-red-700 p-3 transition-colors">
            <Ticket />
            Kjøp billett
          </button>
        </div>
      </div>
    </div>
  );
}
