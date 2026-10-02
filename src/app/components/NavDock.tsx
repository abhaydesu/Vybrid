"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { GridIcon, HomeIcon, ToolboxIcon } from "./Icons";
import Logo from "./Logo";
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
  // The tab tapped last, shown as current straight away so the key doesn't
  // bounce back up while the next page loads. Dropped once the route changes.
  const [pending, setPending] = useState<{ href: string; from: string } | null>(null);
  const current = (href: string) =>
    pending && pending.from === pathname ? pending.href === href : isActive(pathname, href);
  const select = (e: React.MouseEvent, href: string) => {
    // Modified clicks open a new tab, so this page stays where it is.
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    setPending({ href, from: pathname });
  };
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      {/* Desktop / tablet: a solid bar, so the page scrolls cleanly under it */}
      <header
        data-scrolled={scrolled}
        className="sticky top-0 z-40 hidden border-b border-transparent bg-paper transition-[border-color] duration-200 data-[scrolled=true]:border-line md:block"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3 lg:px-8">
          <Logo />
          <nav
            aria-label="Main"
            className="nav-tray flex items-center gap-2 p-2 pb-3"
          >
            {items.map(({ href, label, tone, Icon }) => (
              <Link
                key={href}
                href={href}
                aria-current={current(href) ? "page" : undefined}
                onClick={(e) => select(e, href)}
                className={`navkey lego-${tone} h-11 px-4 text-[0.95rem]`}
              >
                <Icon width={18} height={18} />
                {label}
              </Link>
            ))}
            <SurpriseButton className="navkey navkey-accent lego-pink h-11 px-4 text-[0.95rem]" />
          </nav>
        </div>
      </header>

      {/* Mobile: slim logo header + bottom dock */}
      <header className="flex h-16 items-center px-4 md:hidden">
        <Logo />
      </header>

      <nav
        aria-label="Main"
        className="safe-bottom fixed inset-x-0 bottom-0 z-40 px-3 md:hidden"
      >
        <div className="nav-tray mx-auto grid max-w-md grid-cols-4 gap-2 p-2 pb-3 shadow-[0_-8px_24px_-12px_rgb(0_0_0/0.25)]">
          {items.map(({ href, label, tone, Icon }) => (
            <Link
              key={href}
              href={href}
              aria-current={current(href) ? "page" : undefined}
              onClick={(e) => select(e, href)}
              className={`navkey lego-${tone} h-14 flex-col gap-0.5 text-[0.72rem]`}
            >
              <Icon />
              {label}
            </Link>
          ))}
          <SurpriseButton
            compact
            className="navkey navkey-accent lego-pink h-14 flex-col gap-0.5 text-[0.72rem]"
          />
        </div>
      </nav>
    </>
  );
}
