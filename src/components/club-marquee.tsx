import Image from "next/image";
import Link from "next/link";
import type { Club } from "@/lib/data/clubs";

// One slow line of every campus. Two copies of the list so the loop has no
// seam; the second is aria-hidden so screen readers hear each club once.
export function ClubMarquee({ clubs }: { clubs: Club[] }) {
  return (
    <div
      className="group/marquee relative overflow-hidden border-y border-[#1d1d1f]/10"
      style={{
        maskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
        WebkitMaskImage:
          "linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent)",
      }}
    >
      <div className="marquee-track flex w-max group-hover/marquee:[animation-play-state:paused]">
        {[0, 1].map((copy) => (
          <ul
            key={copy}
            aria-hidden={copy === 1 || undefined}
            className="flex shrink-0 items-center"
          >
            {clubs.map((c) => (
              <li key={c.slug} className="shrink-0">
                <Link
                  href={`/clubs#${c.slug}`}
                  tabIndex={copy === 1 ? -1 : 0}
                  className="flex items-center gap-3 py-5 pr-12 text-sm text-[#1d1d1f]/60 transition-colors hover:text-[#1d1d1f] md:py-6 md:pr-16"
                >
                  <span className="relative h-7 w-7 shrink-0 overflow-hidden rounded-full bg-[#f5f5f7] ring-1 ring-[#1d1d1f]/5">
                    <Image
                      src={c.logo}
                      alt=""
                      fill
                      sizes="28px"
                      className="object-contain p-1"
                      unoptimized={c.logo.endsWith(".gif")}
                    />
                  </span>
                  <span className="whitespace-nowrap font-medium">
                    {c.shortName ?? c.school}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        ))}
      </div>
    </div>
  );
}
