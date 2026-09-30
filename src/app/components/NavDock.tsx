"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { GridIcon, HomeIcon, ToolboxIcon } from "./Icons";
import SurpriseButton from "./SurpriseButton";

const items = [
  { href: "/", label: "Home", tone: "yellow", Icon: HomeIcon },
  { href: "/games", label: "Games", tone: "blue", Icon: GridIcon },
  { href: "/tools", label: "Tools", tone: "green", Icon: ToolboxIcon },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function NavDock() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop / tablet: top bar with logo */}
      <header className="sticky top-0 z-40 hidden px-6 pt-4 md:block">
        <div className="mx-auto flex max-w-6xl items-center justify-between">
          <Logo />
          <nav
            aria-label="Main"
            className="flex items-center gap-2 rounded-[1.6rem] border-2 border-line bg-white/75 p-2 pb-3 shadow-[0_10px_30px_-12px_rgb(70_50_20/0.3)] backdrop-blur-md"
          >
            {items.map(({ href, label, tone, Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={isActive(pathname, href) ? "page" : undefined}
                className={`keycap tone-${tone} h-11 px-4 text-sm`}
              >
                <Icon width={18} height={18} />
                {label}
              </Link>
            ))}
            <SurpriseButton className="keycap tone-pink h-11 px-4 text-sm" />
          </nav>
        </div>
      </header>

      {/* Mobile: slim logo header + bottom dock */}
      <header className="flex items-center justify-between px-4 pt-4 md:hidden">
        <Logo />
      </header>

      <nav
        aria-label="Main"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 px-3 md:hidden"
      >
        <div className="mx-auto grid max-w-md grid-cols-4 gap-2 rounded-[1.75rem] border-2 border-line bg-white/85 p-2 pb-3 shadow-[0_-4px_30px_-10px_rgb(70_50_20/0.35)] backdrop-blur-md">
          {items.map(({ href, label, tone, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={isActive(pathname, href) ? "page" : undefined}
              className={`keycap tone-${tone} h-14 flex-col gap-0.5 text-[0.7rem]`}
            >
              <Icon />
              {label}
            </Link>
          ))}
          <SurpriseButton
            compact
            className="keycap tone-pink h-14 flex-col gap-0.5 text-[0.7rem]"
          />
        </div>
      </nav>
    </>
  );
}

function Logo() {
  return (
    <Link
      href="/"
      className="group flex items-center gap-2.5"
      aria-label="Vybrid home"
    >
      <span className="relative grid h-10 w-10 place-items-center">
        <span className="absolute inset-0 grid grid-cols-2 gap-[3px] transition-transform duration-300 ease-[var(--ease-bounce)] group-hover:rotate-12">
          <span className="rounded-[6px] border-2 border-[#c63a28] bg-[#ff5a45]" />
          <span className="rounded-[6px] border-2 border-[#c99400] bg-[#ffc61a]" />
          <span className="rounded-[6px] border-2 border-[#1a64c7] bg-[#2f8cff]" />
          <span className="rounded-[6px] border-2 border-[#178443] bg-[#25b35f]" />
        </span>
      </span>
      <span className="font-display text-2xl font-extrabold tracking-tight">
        vybrid
      </span>
    </Link>
  );
}
