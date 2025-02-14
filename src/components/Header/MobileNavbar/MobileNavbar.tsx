import React, {
  useEffect,
  useState,
  type AllHTMLAttributes,
  type ReactNode,
} from "react";

import { X } from "lucide-react";

interface Props extends AllHTMLAttributes<HTMLDivElement> {
  items: { [href: string]: string };
}

function NavbarSlider({
  items,
  onClose,
}: Readonly<Props & { onClose: () => void }>) {
  const navItems = Object.entries(items).map(([href, title]) => (
    <li
      key={href}
      className="text-lg text-foreground underline hover:text-accent"
    >
      <a href={href}>{title}</a>
    </li>
  ));

  return (
    <div className="h-full w-full rounded-l-xl border-l border-bg-accent bg-background px-6">
      <div className="flex h-32 items-center justify-between">
        <span
          id="navbar-title"
          className="font-serif text-xl font-medium tracking-tight md:text-2xl"
        >
          Abakusrevyen
        </span>
        <button onClick={() => onClose()}>
          <X />
        </button>
      </div>
      <ul className="items-left flex w-full flex-col gap-8">{navItems}</ul>
    </div>
  );
}

export default function MobileNavbar({ items, children }: Readonly<Props>) {
  const [isOpen, setOpen] = useState(false);

  function close() {
    setOpen(false);
    console.log("Closing");
  }

  return (
    <>
      <button onClick={() => setOpen(!isOpen)}>{children}</button>
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-5/6 overflow-hidden ${!isOpen && "pointer-events-none"}`}
      >
        <div
          className={`h-full w-full transition-transform ${!isOpen && "translate-x-full"}`}
        >
          <NavbarSlider items={items} onClose={close} />
        </div>
      </div>
    </>
  );
}
