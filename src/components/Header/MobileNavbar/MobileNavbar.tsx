import React, {
  useEffect,
  useState,
  type AllHTMLAttributes,
  type ReactNode,
} from "react";

import Logo from "../../Branding/Logo.tsx";
import { X as Close } from "lucide-react";
import { AlignJustify as Hamburger } from "lucide-react";
import ThemeSwitcher from "../ThemeSwitcher.tsx";

interface Props extends AllHTMLAttributes<HTMLDivElement> {
  items: { [href: string]: string };
}

function Navbar({
  items,
  isOpen,
  setOpen,
}: Readonly<
  Props & {
    isOpen: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }
>) {
  const navItems = Object.entries(items).map(([href, title]) => (
    <li
      key={href}
      className="text-lg text-foreground hover:text-accent hover:underline"
    >
      <a href={href}>{title}</a>
    </li>
  ));

  return (
    <div className="h-full w-full rounded-l-xl bg-background px-6">
      <div className="flex h-32 items-center justify-between">
        <a href="/" data-astro-prefetch="load">
          <Logo />
        </a>
        <ThemeSwitcher />
        <button onClick={() => setOpen(!isOpen)} className="flex md:hidden">
          <span
            className={`text-foreground transition-all duration-1000 hover:text-accent`}
          >
            <Close
              className={`rotate-90 opacity-0 transition-all ${isOpen ? "rotate-0 opacity-100" : ""}`}
            />
          </span>
        </button>
      </div>
      <ul className="items-left flex w-full flex-col gap-8">{navItems}</ul>
    </div>
  );
}

export default function MobileNavbar({ items }: Readonly<Props>) {
  const [isOpen, setOpen] = useState<boolean>(false);

  return (
    <>
      <div
        className={`fixed right-0 top-0 z-50 h-screen w-full overflow-hidden ${!isOpen ? "pointer-events-none hidden" : ""}`}
      >
        <div className={`h-full w-full`}>
          <Navbar items={items} isOpen setOpen={setOpen} />
        </div>
      </div>
      <>
        <a href="/" data-astro-prefetch="load">
          <Logo />
        </a>
        <ThemeSwitcher />
        <button onClick={() => setOpen(!isOpen)} className="flex md:hidden">
          <span
            className={`relative text-foreground transition-all duration-1000 hover:text-accent`}
          >
            <Hamburger
              className={`absolute left-0 top-0 transition-all ${!isOpen ? "rotate-0 opacity-100" : "rotate-90 opacity-0"}`}
            />
          </span>
        </button>
      </>
    </>
  );
}
