import Link from "next/link";

import { MARK_SVG } from "@/lib/og/mark";

/** The logo mark (see src/lib/og/mark.tsx). */
export function LogoMark({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={`inline-block aspect-[60/42] [&>svg]:h-full [&>svg]:w-full ${className ?? ""}`}
      dangerouslySetInnerHTML={{ __html: MARK_SVG }}
    />
  );
}

export default function Logo({ className }: { className?: string }) {
  return (
    <Link
      href="/"
      className={`group flex items-center gap-2 ${className ?? ""}`}
      aria-label="Baithak home"
    >
      <LogoMark className="logo-mark h-10" />
      <span className="font-display text-[1.7rem] font-bold leading-none tracking-[-0.02em] text-ink">
        baithak
      </span>
    </Link>
  );
}
