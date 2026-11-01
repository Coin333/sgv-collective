"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/events", label: "Events" },
  { href: "/everything-night", label: "Everything Night" },
  { href: "/clubs", label: "Clubs" },
  { href: "/next-steps", label: "Next Steps" },
  { href: "/leadership", label: "Leadership" },
  { href: "/churches", label: "Churches" },
  { href: "/contact", label: "Contact" },
];

export function ScrollNav() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    function onScroll() {
      const scrollY = window.scrollY;
      const docHeight = document.documentElement.scrollHeight;
      const winHeight = window.innerHeight;
      const nearBottom = scrollY + winHeight >= docHeight - 200;
      setVisible(scrollY > 80 && !nearBottom);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOpen(false);
  }, [pathname]);

  // Hide nav entirely on /admin and printable cutout sheets to keep the focus.
  if (pathname?.startsWith("/admin")) return null;
  if (pathname?.startsWith("/club-cutouts/print")) return null;

  return (
    <nav
      aria-label="Main"
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-white/80 border-b border-[var(--color-sky-100)]"
      style={{
        transform: visible || open ? "translateY(0)" : "translateY(-110%)",
        opacity: visible || open ? 1 : 0,
        transition: "transform 0.35s ease, opacity 0.35s ease",
      }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="flex items-center gap-2 group"
          aria-label="SGV Christian Club Collective"
        >
          <span className="relative w-10 h-10 grid place-items-center">
            <Image
              src="/images/sgv-logo.png"
              alt="SGV Christian Club Collective logo"
              width={40}
              height={40}
              className="w-10 h-10 object-contain"
              priority
            />
            <span className="absolute -inset-1 rounded-xl ring-1 ring-[var(--color-baby)] opacity-0 group-hover:opacity-100 transition" />
          </span>
          <span className="hidden sm:block">
            <span className="block text-sm font-semibold text-[var(--color-navy)] leading-tight">
              Christian Club Collective
            </span>
            <span className="block text-[11px] text-[var(--color-sky-600)] leading-tight">
              San Gabriel Valley
            </span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-1">
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200",
                  active
                    ? "text-[var(--color-navy)] bg-[var(--color-sky-50)]"
                    : "text-[var(--color-sky-700)] hover:text-[var(--color-navy)] hover:bg-[var(--color-sky-50)]",
                )}
              >
                {l.label}
              </Link>
            );
          })}
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/clubs"
            className="hidden md:inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold bg-[var(--color-navy)] text-white hover:bg-[var(--color-navy-soft)] transition-all duration-200 cursor-pointer shadow-md shadow-[var(--color-navy)]/20"
          >
            Find your club
          </Link>
          <button
            type="button"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="lg:hidden p-2 rounded-lg text-[var(--color-navy)] hover:bg-[var(--color-sky-50)] transition cursor-pointer"
          >
            {open ? (
              <X className="w-5 h-5" aria-hidden="true" />
            ) : (
              <Menu className="w-5 h-5" aria-hidden="true" />
            )}
          </button>
        </div>
      </div>

      <div
        className={cn(
          "lg:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out border-t border-[var(--color-sky-100)]",
          open ? "max-h-[640px] opacity-100" : "max-h-0 opacity-0",
        )}
      >
        <div className="px-4 sm:px-6 py-3 grid grid-cols-2 gap-1.5 bg-white">
          {links.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={cn(
                  "px-3 py-2.5 rounded-lg text-sm font-medium transition",
                  active
                    ? "bg-[var(--color-navy)] text-white"
                    : "text-[var(--color-sky-700)] bg-[var(--color-sky-50)] hover:bg-[var(--color-sky-100)]",
                )}
              >
                {l.label}
              </Link>
            );
          })}
          <Link
            href="/clubs"
            className="col-span-2 mt-1 px-3 py-2.5 rounded-lg text-sm font-semibold bg-[var(--color-baby)] text-[var(--color-navy)] text-center"
          >
            Find your club
          </Link>
        </div>
      </div>
    </nav>
  );
}
