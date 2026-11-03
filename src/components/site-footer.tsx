"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { InstagramIcon } from "@/components/icons/instagram";
import { founded } from "@/lib/data/years";

const columns = [
  {
    title: "Explore",
    links: [
      { href: "/about", label: "About" },
      { href: "/legacy", label: "Our story" },
      { href: "/events", label: "Gatherings" },
      { href: "/everything-night", label: "Everything Night" },
      { href: "/clubs", label: "Clubs" },
    ],
  },
  {
    title: "For clubs",
    links: [
      { href: "/playbooks", label: "Playbooks" },
      { href: "/next-steps", label: "Next steps" },
      { href: "/club-cutouts", label: "Club Cutouts" },
      { href: "/churches", label: "Partner churches" },
      { href: "/contact?type=start", label: "Start a club" },
    ],
  },
  {
    title: "Connect",
    links: [
      { href: "/leadership", label: "Leadership" },
      { href: "/contact", label: "Contact" },
      { href: "mailto:sgvchristianclubs@gmail.com", label: "Email" },
    ],
  },
];

export function SiteFooter() {
  const pathname = usePathname();
  if (pathname?.startsWith("/club-cutouts/print")) return null;
  if (pathname?.startsWith("/admin")) return null;

  return (
    <footer className="bg-[#f5f5f7] text-[#1d1d1f] print:hidden">
      <div className="mx-auto max-w-[1180px] px-5 py-16 sm:px-8 md:py-20">
        <div className="grid gap-12 md:grid-cols-12 md:gap-8">
          <div className="md:col-span-5">
            <p className="font-display text-2xl font-semibold tracking-[-0.03em]">
              SGV Christian Club Collective
            </p>
            <p className="mt-3 max-w-sm text-sm leading-relaxed text-[#6e6e73]">
              A network of student-led Christian clubs across the San Gabriel
              Valley. Started {founded}. Led by students since.
            </p>
            <a
              href="https://instagram.com/sgv_christiancc"
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex items-center gap-2 text-sm font-medium"
            >
              <InstagramIcon className="h-4 w-4" />
              @sgv_christiancc
            </a>
          </div>

          {columns.map((col) => (
            <div key={col.title} className="md:col-span-2">
              <h3 className="text-xs font-medium uppercase tracking-[0.14em] text-[#6e6e73]">
                {col.title}
              </h3>
              <ul className="mt-4 space-y-2.5 text-sm">
                {col.links.map((l) =>
                  l.href.startsWith("mailto:") ? (
                    <li key={l.href}>
                      <a href={l.href} className="hover:text-[#6e6e73]">
                        {l.label}
                      </a>
                    </li>
                  ) : (
                    <li key={l.href}>
                      <Link href={l.href} className="hover:text-[#6e6e73]">
                        {l.label}
                      </Link>
                    </li>
                  ),
                )}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-2 border-t border-[#1d1d1f]/10 pt-6 text-xs text-[#6e6e73] sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} SGV Christian Club Collective</p>
          <p>Through Him, we are chosen.</p>
        </div>
      </div>
    </footer>
  );
}
