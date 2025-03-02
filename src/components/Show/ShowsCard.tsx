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

function Segment({
  children,
  className,
}: Readonly<{ children: ReactNode; className?: string }>) {
  return <div className={`p-2 ${className}`}>{children}</div>;
}

function InfoField({
  icon,
  children,
}: Readonly<{ icon: ReactNode; children: ReactNode }>) {
  return (
    <Segment className="flex gap-1 rounded-md bg-secondary">
      {icon}
      {children}
    </Segment>
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
      <div className="grid grid-cols-4 items-center gap-3 px-6 py-3">
        <span className="px-2">Hvor</span>
        <span className="px-2">Når</span>
        <span className="px-2">Billett</span>
        <a
          className="flex items-center justify-end px-2"
          target="_blank"
          href={show.href}
        >
          <span>Mer info</span>
          <ArrowRight />
        </a>
        <InfoField icon={<Clock />}>
          {show.when.toLocaleString("no-NB", {
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
            timeZone: "Europe/Oslo",
          })}
        </InfoField>
        <InfoField icon={<MapPin />}>{show.where}</InfoField>
        <Button href={show.tickets.live}>Live billett</Button>
        <Button href={show.tickets.stream}>Stream billett</Button>
      </div>
    </div>
  );
}
