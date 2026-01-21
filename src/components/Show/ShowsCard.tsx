import { useEffect, useState, type ReactNode } from "react";
import { SHOWS } from "@/lib/shows";
import { MapPin, Ticket, Clock, TvMinimalPlay } from "lucide-react";
import { nextShow } from "@/lib/periods";

interface Props {}

function TabButton({
  onClick,
  active,
  children,
  past,
}: Readonly<{
  onClick: () => void;
  active: boolean;
  children: ReactNode;
  past: boolean;
}>) {
  return (
    <button
      className={`rounded-t-lg p-3 transition-colors sm:px-6 sm:py-3 ${active && "bg-primary"}`}
      onClick={onClick}
    >
      <span className={past ? "line-through opacity-50" : ""}>{children}</span>
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
  disabled = false,
}: Readonly<{ href: string; children: ReactNode; disabled?: boolean }>) {
  return (
    <a
      target="_blank"
      href={!disabled ? href : undefined}
      className={`${disabled && "cursor-not-allowed text-gray-500"} flex gap-1.5 rounded-md bg-white p-2 text-black shadow-sm shadow-red-800 transition-all hover:bg-gray-300 hover:shadow-md`}
    >
      {children}
    </a>
  );
}

export default function ShowsCard({}: Readonly<Props>) {
  const indexShow = SHOWS.indexOf(nextShow() || SHOWS[0]);
  const [tab, setTab] = useState(indexShow);
  const [show, setShow] = useState(SHOWS[tab]);
  const [ticketTab, setTicketTab] = useState(false);

  useEffect(() => {
    setShow(SHOWS[tab]);
  }, [tab]);

  return (
    <div className="w-full max-w-screen-sm rounded-lg bg-primary text-white">
      <div className="flex rounded-t-lg bg-secondary">
        {SHOWS.map((show, i) => {
          const isPast = new Date(show.when) < new Date(); // Check if the show's date is in the past
          return (
            <TabButton
              onClick={() => setTab(i)}
              active={tab === i}
              past={isPast}
              key={i}
            >
              {show.name}
            </TabButton>
          );
        })}
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
          <a
            href={show.where.mapLink}
            target="_blank"
            rel="noopener noreferrer"
            className="hover:underline"
          >
            {show?.where?.name}
          </a>
        </InfoField>
      </div>
      <div className="grid grid-cols-1 gap-3 p-3 md:grid-cols-2">
        <Button
          href={show.tickets.live || ""}
          disabled={show.tickets.live === undefined}
        >
          <Ticket />
          Kjøp billetter
        </Button>
        <Button
          href={show.tickets.stream || ""}
          disabled={show.tickets.stream === undefined}
        >
          <TvMinimalPlay />
          Gå til live-stream
        </Button>
      </div>
    </div>
  );
}
