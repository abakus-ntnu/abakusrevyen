import { HeartOff } from "lucide-astro";
import { useState, type AllHTMLAttributes } from "react";

interface Props extends AllHTMLAttributes<HTMLDivElement> {
  items: { [href: string]: string };
}

export default function MobileNavbar({
  items,
  children,
  ...rest
}: Readonly<Props>) {
  const [visible, setVisible] = useState(false);

  const hamburgerButton = (
    <button onClick={() => setVisible(!visible)}>{children}</button>
  );

  const navItems = Object.entries(items).map(([href, title]) => (
    <li className="text-lg text-foreground hover:text-accent">
      <a href={href}>{title}</a>
    </li>
  ));

  return (
    <>
      <div
        className={`absolute ${
          visible ? "" : "hidden"
        } top-32 left-0 w-screen h-[calc(100vh-128px)] z-50 bg-background`}
      >
        <ul className="flex w-full flex-col items-center gap-6">
          {navItems}
        </ul>
      </div>
      {hamburgerButton}
    </>
  );
}
