"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

// Kept to the draft site map. Everything Night and Leadership pages still
// exist, they just no longer earn a slot in the bar.
const links = [
  { href: "/about", label: "About" },
  { href: "/clubs", label: "Clubs" },
  { href: "/events", label: "Gatherings" },
  { href: "/next-steps", label: "Next Steps" },
  { href: "/churches", label: "Churches" },
  { href: "/contact", label: "Contact" },
];

export function ScrollNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.documentElement.style.overflow = open ? "hidden" : "";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, [open]);

  // Hide nav entirely on /admin and printable cutout sheets to keep the focus.
  if (pathname?.startsWith("/admin")) return null;
  if (pathname?.startsWith("/club-cutouts/print")) return null;

  const isActive = (href: string) => pathname?.startsWith(href);

  return (
    <nav aria-label="Main" className="fixed inset-x-0 top-0 z-50">
      <div
        className={cn(
          "relative z-10 border-b backdrop-blur-xl backdrop-saturate-[1.8] transition-colors duration-300",
          open
            ? "bg-white border-transparent"
            : "bg-[rgba(251,251,253,0.78)] border-black/[0.06]",
        )}
      >
        <div className="mx-auto flex h-12 max-w-[1024px] items-center justify-between px-4 sm:px-6">
          <Link
            href="/"
            aria-label="SGV Christian Club Collective, home"
            className="shrink-0 opacity-90 transition-opacity hover:opacity-100"
          >
            <Image
              src="/images/sgv-logo.png"
              alt=""
              width={28}
              height={28}
              className="h-7 w-7 object-contain"
              priority
            />
          </Link>

          <ul className="hidden items-center gap-9 md:flex">
            {links.map((l) => (
              <li key={l.href}>
                <Link
                  href={l.href}
                  aria-current={isActive(l.href) ? "page" : undefined}
                  className={cn(
                    "text-xs tracking-[-0.01em] transition-colors duration-200",
                    isActive(l.href)
                      ? "text-[#1d1d1f]"
                      : "text-[#1d1d1f]/70 hover:text-[#1d1d1f]",
                  )}
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-3">
            <Link
              href="/clubs"
              className="hidden rounded-full bg-[var(--color-navy)] px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-[var(--color-navy-soft)] sm:inline-flex"
            >
              Find your club
            </Link>
            <button
              type="button"
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              onClick={() => setOpen((v) => !v)}
              className="relative -mr-2 grid h-10 w-10 cursor-pointer place-items-center md:hidden"
            >
              <span
                className={cn(
                  "absolute h-px w-4 bg-[#1d1d1f] transition-transform duration-300",
                  open ? "rotate-45" : "-translate-y-[3px]",
                )}
              />
              <span
                className={cn(
                  "absolute h-px w-4 bg-[#1d1d1f] transition-transform duration-300",
                  open ? "-rotate-45" : "translate-y-[3px]",
                )}
              />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          "fixed inset-0 top-12 bg-white transition-opacity duration-300 md:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      >
        <ul className="px-8 pt-6">
          {links.map((l, i) => (
            <li
              key={l.href}
              className={cn(
                "transition-all duration-500 ease-out",
                open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
              )}
              style={{ transitionDelay: open ? `${60 + i * 35}ms` : "0ms" }}
            >
              <Link
                href={l.href}
                tabIndex={open ? 0 : -1}
                className="block py-2 font-display text-[28px] font-semibold tracking-[-0.02em] text-[#1d1d1f]"
              >
                {l.label}
              </Link>
            </li>
          ))}
          <li
            className={cn(
              "pt-6 transition-all duration-500 ease-out",
              open ? "translate-y-0 opacity-100" : "-translate-y-2 opacity-0",
            )}
            style={{ transitionDelay: open ? "290ms" : "0ms" }}
          >
            <Link
              href="/clubs"
              tabIndex={open ? 0 : -1}
              className="inline-flex rounded-full bg-[var(--color-navy)] px-5 py-2.5 text-sm font-medium text-white"
            >
              Find your club
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}
